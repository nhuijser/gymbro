const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("@discordjs/builders");
const { ButtonStyle, ActionRow } = require("discord.js");
const getDatabase = require("../database/database").getDatabase;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("🏆 Show off your profile and strength!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user's profile you want to view")
    ),

  async execute(interaction) {
    let achievements = {};
    const database = getDatabase();

    const userId =
      interaction.options.getUser("user")?.id ?? interaction.user.id;
    const user = database
      .prepare("SELECT * FROM profiles WHERE id = ?")
      .get(userId);

    if (!user) {
      await interaction.reply({
        content: "This user doesn't have a profile yet! Tell them to use /pr",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(
        `🏆 ${userId === interaction.user.id ? "Your" : "Their"} Profile`
      )
      .setColor(0xff865a) // Or one of Discord's predefined color names
      .setFooter({
        text: "You can change this anytime using /pr",
      });

    if (user.bench) {
      const benchUnit = user.unit === "lbs" ? "lbs" : "kg";
      const benchWeight =
        user.unit === "lbs" ? user.bench : Math.round(user.bench);
      let calcWeight;
      if (user.unit === "lbs") {
        calcWeight = Math.round(benchWeight / 2.2);
      } else {
        calcWeight = benchWeight;
      }
      if (calcWeight < 100 && calcWeight >= 60) {
        embed.addFields({
          name: "Bench Press ⭐️",
          value: `${benchWeight}${benchUnit}`,
          inline: true,
        });

        achievements.bench = {
          icon: "⭐️",
        };

        achievements.bench.description =
          userId === interaction.user.id
            ? `You're benching over ${
                user.unit === "lbs" ? "130lbs" : "60kg"
              }, nice!`
            : `They're benching over ${
                user.unit === "lbs" ? "130lbs" : "60kg"
              }, nice!`;
      } else if (calcWeight >= 100 && calcWeight < 140) {
        embed.addFields({
          name: "Bench Press 🌟",
          value: `${benchWeight}${benchUnit}`,
          inline: true,
        });

        achievements.bench = {
          icon: "🌟",
        };

        achievements.bench.description =
          userId === interaction.user.id
            ? `You're benching over ${
                user.unit === "lbs" ? "200lbs" : "100kg"
              }, insane!`
            : `They're benching over ${
                user.unit === "lbs" ? "200lbs" : "100kg"
              }, insane!`;
      } else if (calcWeight >= 140 && calcWeight < 180) {
        embed.addFields({
          name: "Bench Press 💎",
          value: `${benchWeight}${benchUnit}`,
          inline: true,
        });

        achievements.bench = {
          icon: "💎",
        };

        achievements.bench.description =
          userId === interaction.user.id
            ? `You're benching over ${
                user.unit === "lbs" ? "270lbs" : "140kg"
              }, your chest must be huge!`
            : `They're benching over ${
                user.unit === "lbs" ? "270lbs" : "140kg"
              }, their chest must be huge!`;
      } else if (calcWeight >= 180) {
        embed.addFields({
          name: "Bench Press 🏆",
          value: `${benchWeight}${benchUnit}`,
          inline: true,
        });

        achievements.bench = {
          icon: "🏆",
        };

        achievements.bench.description =
          userId === interaction.user.id
            ? `You're benching over ${
                user.unit === "lbs" ? "400lbs" : "180kg"
              }, you're a beast!`
            : `They're benching over ${
                user.unit === "lbs" ? "400lbs" : "180kg"
              }, they're a beast!`;
      } else {
        embed.addFields({
          name: "Bench Press",
          value: `${benchWeight}${benchUnit}`,
          inline: true,
        });
      }
    }

    if (user.squat) {
      const squatUnit = user.unit === "lbs" ? "lbs" : "kg";
      const squatWeight =
        user.unit === "lbs" ? user.squat : Math.round(user.squat);
      let calcWeight;
      if (user.unit === "lbs") {
        calcWeight = Math.round(squatWeight / 2.2);
      } else {
        calcWeight = squatWeight;
      }

      if (calcWeight < 100 && calcWeight >= 60) {
        embed.addFields({
          name: "Squat ⭐️",
          value: `${squatWeight}${squatUnit}`,
          inline: true,
        });

        achievements.squat = {
          icon: "⭐️",
        };

        achievements.squat.description =
          userId === interaction.user.id
            ? `You're squatting over ${
                user.unit === "lbs" ? "130lbs" : "60kg"
              }, nice!`
            : `They're squatting over ${
                user.unit === "lbs" ? "130lbs" : "60kg"
              }, nice!`;
      } else if (calcWeight >= 100 && calcWeight < 140) {
        embed.addFields({
          name: "Squat 🌟",
          value: `${squatWeight}${squatUnit}`,
          inline: true,
        });

        achievements.squat = {
          icon: "🌟",
        };

        achievements.squat.description =
          userId === interaction.user.id
            ? `You're squatting over ${
                user.unit === "lbs" ? "200lbs" : "100kg"
              }, insane!`
            : `They're squatting over ${
                user.unit === "lbs" ? "200lbs" : "100kg"
              }, insane!`;
      } else if (calcWeight >= 140 && calcWeight < 180) {
        embed.addFields({
          name: "Squat 💎",
          value: `${squatWeight}${squatUnit}`,
          inline: true,
        });

        achievements.squat = {
          icon: "💎",
        };

        achievements.squat.description =
          userId === interaction.user.id
            ? `You're squatting over ${
                user.unit === "lbs" ? "180lbs" : "140kg"
              }, your legs must be huge!`
            : `They're squatting over ${
                user.unit === "lbs" ? "180lbs" : "140kg"
              }, their legs must be huge!`;
      } else if (calcWeight >= 180) {
        embed.addFields({
          name: "Squat 🏆",
          value: `${squatWeight}${squatUnit}`,
          inline: true,
        });

        achievements.squat = {
          icon: "🏆",
        };

        achievements.squat.description =
          userId === interaction.user.id
            ? `You're squatting over ${
                user.unit === "lbs" ? "270lbs" : "180kg"
              }, you're a beast!`
            : `They're squatting over ${
                user.unit === "lbs" ? "270lbs" : "180kg"
              }, they're a beast!`;
      } else {
        embed.addFields({
          name: "Squat",
          value: `${squatWeight}${squatUnit}`,
          inline: true,
        });
      }
    }

    if (user.deadlift) {
      const deadliftUnit = user.unit === "lbs" ? "lbs" : "kg";
      const deadliftWeight =
        user.unit === "lbs" ? user.deadlift : Math.round(user.deadlift);
      let calcWeight;
      if (user.unit === "lbs") {
        calcWeight = Math.round(deadliftWeight / 2.2);
      } else {
        calcWeight = deadliftWeight;
      }

      if (calcWeight < 100 && calcWeight >= 60) {
        embed.addFields({
          name: "Deadlift ⭐️",
          value: `${deadliftWeight}${deadliftUnit}`,
          inline: true,
        });

        achievements.deadlift = {
          icon: "⭐️",
        };

        achievements.deadlift.description =
          userId === interaction.user.id
            ? `You're deadlifting over ${
                user.unit === "lbs" ? "130lbs" : "60kg"
              }, nice!`
            : `They're deadlifting over ${
                user.unit === "lbs" ? "130lbs" : "60kg"
              }, nice!`;
      } else if (calcWeight >= 100 && calcWeight < 140) {
        embed.addFields({
          name: "Deadlift 🌟",
          value: `${deadliftWeight}${deadliftUnit}`,
          inline: true,
        });

        achievements.deadlift = {
          icon: "🌟",
        };

        achievements.deadlift.description =
          userId === interaction.user.id
            ? `You're deadlifting over ${
                user.unit === "lbs" ? "200lbs" : "100kg"
              }, insane!`
            : `They're deadlifting over ${
                user.unit === "lbs" ? "200lbs" : "100kg"
              }, insane!`;
      } else if (calcWeight >= 140 && calcWeight < 180) {
        embed.addFields({
          name: "Deadlift 💎",
          value: `${deadliftWeight}${deadliftUnit}`,
          inline: true,
        });

        achievements.deadlift = {
          icon: "💎",
        };

        achievements.deadlift.description =
          userId === interaction.user.id
            ? `You're deadlifting over ${
                user.unit === "lbs" ? "180lbs" : "140kg"
              }, your back must be huge!`
            : `They're deadlifting over ${
                user.unit === "lbs" ? "180lbs" : "140kg"
              }, their back must be huge!`;
      } else if (calcWeight >= 180) {
        embed.addFields({
          name: "Deadlift 🏆",
          value: `${deadliftWeight}${deadliftUnit}`,
          inline: true,
        });

        achievements.deadlift = {
          icon: "🏆",
        };

        achievements.deadlift.description =
          userId === interaction.user.id
            ? `You're deadlifting over ${
                user.unit === "lbs" ? "270lbs" : "180kg"
              }, you're a beast!`
            : `They're deadlifting over ${
                user.unit === "lbs" ? "270lbs" : "180kg"
              }, they're a beast!`;
      } else {
        embed.addFields({
          name: "Deadlift",
          value: `${deadliftWeight}${deadliftUnit}`,
          inline: true,
        });
      }
    }

    if (user.bench && user.squat && user.deadlift) {
      const totalUnit = user.unit === "lbs" ? "lbs" : "kg";
      const totalWeight =
        user.unit === "lbs"
          ? user.bench + user.squat + user.deadlift
          : Math.round(user.bench + user.squat + user.deadlift);

      embed.addFields({
        name: " Total ",
        value: `${totalWeight}${totalUnit}`,
        inline: true,
      });
    }
    embed.addFields({
      name: "Looking good!",
      value: "\u200b",
    });

    if (Object.keys(achievements).length > 0) {
      embed.addFields({
        name: "Achievements",
        value: Object.keys(achievements)
          .map(
            (key) =>
              achievements[key].icon + " " + achievements[key].description
          )
          .join("\n"),
      });
    }

    const sessions = database
      .prepare("SELECT * FROM sessions WHERE id = ?")
      .get(userId);

    console.log(sessions);

    let res;
    let button;
    if (sessions) {
      if (sessions.sessions > 0) {
        button = new ButtonBuilder()
          .setCustomId("sessions")
          .setLabel("Sessions")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji({ name: "🏋️" });
      }

      const row = new ActionRowBuilder().addComponents(button);
      res = await interaction.reply({
        embeds: [embed],
        components: [row],
      });
    } else {
      await interaction.reply({ embeds: [embed] });
    }

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    if (button) {
      try {
        const confirmation = await res.awaitMessageComponent({
          filter: collectorFilter,
          time: 60000,
        });

        if (confirmation.customId === "sessions") {
          const embed = new EmbedBuilder()
            .setTitle("🏆 Sessions")
            .setColor(0xff865a) // Or one of Discord's predefined color names
            .setFooter({
              text: "You can change this anytime using /pr",
            });

          embed.addFields({
            name: "Total Sessions",
            value: `${sessions.sessions}`,
            inline: true,
          });

          embed.addFields({
            name: "Last Session",
            value: `<t:${sessions.lastSession}:R>`,
            inline: true,
          });

          embed.addFields({
            name: "Last Trained",
            value: `${sessions.lastTrained}`,
            inline: true,
          });

          embed.addFields({
            name: "Chest",
            value: `${sessions.chest}`,
            inline: true,
          });

          embed.addFields({
            name: "Back",
            value: `${sessions.back}`,
            inline: true,
          });

          embed.addFields({
            name: "Shoulders",
            value: `${sessions.shoulders}`,
            inline: true,
          });

          embed.addFields({
            name: "Triceps",
            value: `${sessions.triceps}`,
            inline: true,
          });

          embed.addFields({
            name: "Biceps",
            value: `${sessions.biceps}`,
            inline: true,
          });

          embed.addFields({
            name: "Legs",
            value: `${sessions.legs}`,
            inline: true,
          });

          embed.addFields({
            name: "Core",
            value: `${sessions.core}`,
            inline: true,
          });

          embed.addFields({
            name: "Cardio",
            value: `${sessions.cardio}`,
            inline: true,
          });

          embed.addFields({
            name: "Other",
            value: `${sessions.other}`,
            inline: true,
          });

          embed.addFields({
            name: "Total",
            value: `${sessions.total}`,
            inline: true,
          });

          await res.edit({ embeds: [embed], components: [] });
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
};
