const { App } = require("@slack/bolt");

// Create a new instance of the App class with the bot token

const app = new App({
  token: "xoxb-4888952385430-4894288620645-e2KJh4a4BZa1Wv7xqgwdag8Y",
  signingSecret: "716b82045665d019c6b925463fa26a2b",
});
const { createEventAdapter } = require("@slack/events-api");
const { default: axios } = require("axios");
const slackSigningSecret = "716b82045665d019c6b925463fa26a2b";
const slackEvents = createEventAdapter(slackSigningSecret);
const port = 4000;
const { WebClient, LogLevel } = require("@slack/web-api");

const client = new WebClient("xoxb-your-token", {
  logLevel: LogLevel.DEBUG,
});

//function for sending message to the slack channel
async function publishMessage(id, text) {
  try {
    const result = await app.client.chat.postMessage({
      token: "xoxb-4888952385430-4894288620645-e2KJh4a4BZa1Wv7xqgwdag8Y",
      channel: id,
      text: text,
    });
  } catch (error) {
    console.error(error);
  }
}
//events handling when someone message hello in the channel
slackEvents.on("message", async (event) => {
  if (event.text == "hello") {
    const userProfile = await axios.get(
      `https://slack.com/api/users.profile.get?user=${event.user}`,
      {
        headers: {
          Authorization:
            "Bearer " +
            "xoxb-4888952385430-4894288620645-e2KJh4a4BZa1Wv7xqgwdag8Y",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    publishMessage(
      event.channel,
      `hello @${userProfile.data.profile.real_name} how can i help you ?`
    ).then((d) => {
      console.log("sent message successfully");
    });
  }
});
//event when someone joined the channel
slackEvents.on("member_joined_channel", async(event) => {
    const userProfile = await axios.get(
        `https://slack.com/api/users.profile.get?user=${event.user}`,
        {
          headers: {
            Authorization:
              "Bearer " +
              "xoxb-4888952385430-4894288620645-e2KJh4a4BZa1Wv7xqgwdag8Y",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    publishMessage(event.channel,`hello  gaand marale`)
    .then((data)=>{
        console.log('message sent')
    })
})
//event occured when someone shared the link with the domain we mentioned in slack account
slackEvents.on("link_shared",async (event)=>{
  console.log("Entered")
  const userProfile = await axios.get(
    `https://slack.com/api/users.profile.get?user=${event.user}`,
    {
      headers: {
        Authorization:
          "Bearer " +
          "xoxb-4888952385430-4894288620645-e2KJh4a4BZa1Wv7xqgwdag8Y",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  publishMessage(
    "C04S4U406NA",
    `@${userProfile.data.profile.real_name} share a link`
  ).then((d) => {
    console.log("sent message successfully");
  });
})
//event occured when mew channel is created
slackEvents.on("channel_created", async (event) => {
  if (event.type === "channel_created") {
    const userProfile = await axios.get(
      `https://slack.com/api/users.profile.get?user=${event.channel.creator}`,
      {
        headers: {
          Authorization:
            "Bearer " +
            "xoxb-4888952385430-4894288620645-e2KJh4a4BZa1Wv7xqgwdag8Y",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    publishMessage(
      "C04S4U406NA",
      `@${userProfile.data.profile.real_name} created channel ${event.channel.name}`
    ).then((d) => {
      console.log("sent message successfully");
    });
  }
});

// scheduling a message
async function sched() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  tomorrow.setMinutes(tomorrow.getMinutes() + 1);

  const channelId = "C04S4U406NA";
  try {
    const result = await client.chat.scheduleMessage({
      channel: channelId,
      text: "Looking towards the future",
      post_at: tomorrow.getTime() / 1000,
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  const server = await slackEvents.start(port);
  console.log(`Listening for events on ${server.address().port}`);
  
})();
