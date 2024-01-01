const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const getDatabase = require("../database/database").getDatabase;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("compare")
    .setDescription("🏆 Compare your stats with someone elses")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user's profile you want to compare with")
        .setRequired(true)
    ),

  async execute(interaction) {
    const database = getDatabase();

    const userId = interaction.user.id;
    const user = database
      .prepare("SELECT * FROM profiles WHERE id = ?")
      .get(userId);

    const user2 = interaction.options.getUser("user");
    const user2Id = user2.id;
    const user2Profile = database
      .prepare("SELECT * FROM profiles WHERE id = ?")
      .get(user2Id);

    if (!user2Profile) {
      const embed = new EmbedBuilder()
        .setTitle("🏆 Profile not found!")
        .setDescription(
          `The user you're trying to compare with doesn't have a profile!`
        )
        .setColor(0xff865a) // Or one of Discord's predefined color names
        .setFooter({
          text: "You can create a profile using /pr",
        });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("🏆 Compare Profiles")
      .setDescription(`Here's how you compare with ${user2.username}!`)
      .setColor(0xff865a) // Or one of Discord's predefined color names
      .setFooter({
        text: "You can create a profile using /pr",
      });

    const bench = user.bench;
    const squat = user.squat;
    const deadlift = user.deadlift;
    const bench2 = user2Profile.bench;
    const squat2 = user2Profile.squat;
    const deadlift2 = user2Profile.deadlift;

    const benchEmbed = new EmbedBuilder()
      .setTitle("🏋️ Bench Press")
      .setDescription(
        `**${interaction.user.username}**'s bench: **${bench ?? "Not set"}**${
          user?.unit ?? "kg"
        }\n**${user2.username}**'s bench: **${bench2 ?? "Not set"}**${
          user2Profile?.unit ?? "kg"
        }`
      )
      .setColor(0xff865a) // Or one of Discord's predefined color names
      .setFooter({
        text: "You can create a profile using /pr",
      });

    const squatEmbed = new EmbedBuilder()
      .setTitle("🏋️ Squat")
      .setDescription(
        `**${interaction.user.username}**'s squat: **${squat ?? "Not set"}**${
          user?.unit ?? "kg"
        }\n**${user2.username}**'s squat: **${squat2 ?? "Not set"}**${
          user2Profile?.unit ?? "kg"
        }`
      )
      .setColor(0xff865a) // Or one of Discord's predefined color names
      .setFooter({
        text: "You can create a profile using /pr",
      });

    const deadliftEmbed = new EmbedBuilder()
      .setTitle("🏋️ Deadlift")
      .setDescription(
        `**${interaction.user.username}**'s deadlift: **${
          deadlift ?? "Not set"
        }**${user?.unit ?? "kg"}\n**${user2.username}**'s deadlift: **${
          deadlift2 ?? "Not set"
        }**${user2Profile?.unit ?? "kg"}`
      )
      .setColor(0xff865a) // Or one of Discord's predefined color names
      .setFooter({
        text: "You can create a profile using /pr",
      });

    const benchButton = new ButtonBuilder()
      .setCustomId("bench")
      .setLabel("Bench Press")
      .setStyle(ButtonStyle.Primary);

    const squatButton = new ButtonBuilder()
      .setCustomId("squat")
      .setLabel("Squat")
      .setStyle(ButtonStyle.Primary);

    const deadliftButton = new ButtonBuilder()
      .setCustomId("deadlift")
      .setLabel("Deadlift")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents([
      benchButton,
      squatButton,
      deadliftButton,
    ]);

    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "bench") {
        benchButton.setDisabled(true);
        await i.update({ embeds: [benchEmbed], components: [row] });
        benchButton.setDisabled(false);
      } else if (i.customId === "squat") {
        squatButton.setDisabled(true);
        await i.update({ embeds: [squatEmbed], components: [row] });
        squatButton.setDisabled(false);
      } else if (i.customId === "deadlift") {
        deadliftButton.setDisabled(true);
        await i.update({ embeds: [deadliftEmbed], components: [row] });
        deadliftButton.setDisabled(false);
      }
    });
  },
};
