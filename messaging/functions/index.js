/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.messaging = functions.https.onRequest(async (req, res) => {
  switch (req.method) {
    case "POST": {
      // await receiveMessages(req, res);
      const messagesSnap = await admin.firestore().collection("messages");
      if (req.body) {
        await messagesSnap.add(req.body);
      }
      res.status(200).send(req.body);
      break;
    }
    default: {
      await res.status(405).send({
        error: {
          code: 405,
          message: "Wrong HTTP method",
        },
      });
      break;
    }
  }
});

exports.envaya = functions.https.onRequest(async (req, res) => {
  switch (req.method) {
    case "POST": {
      // await sendMessages(req, res);
      const reqPhoneNumber = req.body.phone_number;
      if (reqPhoneNumber) {
        if (req.body.action === "outgoing") {
          const messagesSnap = await admin
            .firestore()
            .collection("messages")
            .where("phoneNumber", "==", reqPhoneNumber)
            .get();
          const data = messagesSnap.docs.map((doc) => doc.data());
          const eventMessages = data
            .map((event) => {
              if (event.recipient && new Date(event.dateTime) <= new Date()) {
                return {
                  id: event.id,
                  to: event.recipient,
                  message: event.message,
                };
              }
            })
            .filter((eventMessage) => eventMessage);

          res.status(200).send({
            events: [
              {
                event: "send",
                messages: eventMessages,
              },
            ],
          });
        } else if (req.body.action === "send_status") {
          res.status(200).send({
            message: "Sending status",
          });
        } else if (req.body.action === "incoming") {
          res.status(200).send({
            message: "Incoming status",
          });
        } else if (req.body.action === "device_status") {
          res.status(200).send({
            message: "Device status",
          });
        } else if (req.body.action === "test") {
          res.status(200).send({
            message: "Test status",
          });
        } else if (req.body.action === "forward_sent") {
          res.status(200).send({
            message: "Forward status",
          });
        } else if (req.body.action === "amqp_started") {
          res.status(200).send({
            message: "AMQP status",
          });
        } else {
          res.status(200).send({
            message: "Unknown",
          });
        }
      } else {
        await res.status(400).send({
          error: {
            code: 400,
            message: "Missing phone_number parameter",
          },
        });
      }
      break;
    }
    default: {
      await res.status(405).send({
        error: {
          code: 405,
          message: "Wrong HTTP method",
        },
      });
      break;
    }
  }
});
