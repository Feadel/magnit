import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as admin from "firebase-admin";
import { AmqpModule } from "../amqp/amqp.module";
import { AmqpService } from "../amqp/services/amqp.service";
import { PushToken } from "./entities/push-token.entity";
import { IPushMessage } from "./interfaces/push-message.interface";
import { PushTokenController } from "./push-token.controller";
import { PushTokenService } from "./services/push-token.service";

const config = require("../../../firebaseconfig.js");

@Module({
    imports: [TypeOrmModule.forFeature([PushToken]), AmqpModule],
    controllers: [PushTokenController],
    providers: [PushTokenService],
    exports: [PushTokenService],
})
export class PushTokenModule {
    private readonly logger = new Logger(PushTokenModule.name);

    constructor(private readonly amqpService: AmqpService) {
        if (process.env.NODE_ENV === "testing") {
            return;
        }
        if (!config || !config.account) {
            throw new Error("Cannot initialize Firebase without account config");
        }
        admin.initializeApp({ credential: admin.credential.cert(config.account) });
        this.consumePushNotifications().catch(this.logger.error);
    }

    private async consumePushNotifications() {
        const channel = await this.amqpService.getAssertedChannelFor(AmqpService.PUSH_NOTIFICATION);
        await channel.consume(AmqpService.PUSH_NOTIFICATION, async message => {
            const body = await this.amqpService.decodeMessageContent<IPushMessage>(message);
            if (body.token && body.message) {
                try {
                    await admin
                        .messaging()
                        .sendToDevice(body.token, { notification: body.message }, body.options);
                    const safeToLogToken =
                        body.token.slice(0, 8) +
                        "..." +
                        body.token.slice(body.token.length - 8 - 1, body.token.length - 1);
                    this.logger.log(`Push notification to "${safeToLogToken}" successfully sent`);
                } catch (error) {
                    this.logger.error(`Cannot send push to "${body.token}": ${error.message}`);
                }
            }
            channel.ack(message);
        });
    }
}
