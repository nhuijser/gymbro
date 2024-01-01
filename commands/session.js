const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("@discordjs/builders");

const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const getDatabase = require("../database/database").getDatabase;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("session")
    .setDescription("🏆 Quick-log a session"),

  async execute(interaction) {
    const selectionMenu = new StringSelectMenuBuilder()
      .setCustomId("session")
      .setPlaceholder("Select muscle groups you've trained this session!")
      .setMinValues(1)
      .setMaxValues(8)
      .addOptions([
        {
          label: "Chest",
          value: "chest",
          description: "Bench press, incline press, flys, etc.",
        },
        {
          label: "Back",
          value: "back",
          description: "Deadlift, rows, pullups, etc.",
        },
        {
          label: "Shoulders",
          value: "shoulders",
          description: "Overhead press, lateral raises, etc.",
        },
        {
          label: "Triceps",
          value: "triceps",
          description: "Skullcrushers, dips, etc.",
        },
        {
          label: "Biceps",
          value: "biceps",
          description: "Bicep curls, etc.",
        },
        {
          label: "Legs",
          value: "legs",
          description: "Squats, leg press, lunges, etc.",
        },
        {
          label: "Core",
          value: "core",
          description: "Planks, crunches, etc.",
        },
        {
          label: "Cardio",
          value: "cardio",
          description: "Running, cycling, etc.",
        },
        {
          label: "Other",
          value: "other",
          description: "Anything else!",
        },
      ]);

    const row = new ActionRowBuilder().addComponents(selectionMenu);

    const res = await interaction.reply({
      content: "Select muscle groups you've trained this session!",
      components: [row],
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      const confirmation = await res.awaitMessageComponent({
        filter: collectorFilter,
        time: 60000,
      });

      if (confirmation.customId === "session") {
        const database = getDatabase();

        const userId = interaction.user.id;
        const user = database
          .prepare("SELECT * FROM sessions WHERE id = ?")
          .get(userId);

        if (user) {
          database
            .prepare(`UPDATE sessions SET sessions = sessions + 1 WHERE id = ?`)
            .run(userId);
          database
            .prepare(
              `UPDATE sessions SET lastSession = strftime('%s', 'now') WHERE id = ?`
            )
            .run(userId);
          database
            .prepare(`UPDATE sessions SET lastTrained = ? WHERE id = ?`)
            .run(confirmation.values.join(", "), userId);
          confirmation.values.forEach((value) => {
            database
              .prepare(
                `UPDATE sessions SET ${value} = ${value} + 1 WHERE id = ?`
              )
              .run(userId);
          });
        } else {
          database
            .prepare(
              "INSERT INTO sessions (id, sessions, lastSession, chest, back, shoulders, triceps, biceps, legs, chest, core, cardio, other, lastTrained) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            )
            .run(userId, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "None");
          database
            .prepare(`UPDATE sessions SET lastTrained = ? WHERE id = ?`)
            .run(confirmation.values.join(", "), userId);
          confirmation.values.forEach((value) => {
            database
              .prepare(
                `UPDATE sessions SET ${value} = ${value} + 1 WHERE id = ?`
              )
              .run(userId);
          });
        }

        const embed = new EmbedBuilder()
          .setTitle("🏆 Session Logged!")
          .setDescription(
            `You logged a session with the following muscle groups: ${confirmation.values.join(
              ", "
            )}`
          )
          .setColor(0x00ff00)
          .setFooter({
            text: "You can change this anytime using /session",
          });

        await confirmation.update({
          content: "Session logged!",
          embeds: [embed],
          components: [],
        });

        return;
      }
    } catch (e) {
      console.log(e);
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        components: [],
      });
    }
  },
};
