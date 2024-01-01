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
    .setName("excercise")
    .setDescription(
      "🏆 Look for a specific or top series of excercises for a muscle group!"
    )
    .addStringOption((option) =>
      option
        .setName("muscle")
        .setDescription("The muscle group you want to look for")
        .setRequired(true)

        .addChoices(
          { name: "🏋️ Chest", value: "chest" },
          { name: "🏋️ Back", value: "back" },
          { name: "🏋️ Shoulders", value: "shoulders" },
          { name: "🏋️ Triceps", value: "triceps" },
          { name: "🏋️ Biceps", value: "biceps" },
          { name: "🏋️ Legs", value: "legs" },
          { name: "🏋️ Core", value: "core" },
          { name: "🏋️ Cardio", value: "cardio" }
        )
    ),

  async execute(interaction) {
    const muscle = interaction.options.getString("muscle");

    const exc = require("./storage/excercises.json");

    exc.forEach((e) => {
      if (e.primaryMuscles == muscle) {
        console.log(muscle);
        const embed = new EmbedBuilder()
          .setTitle(`🏋️ ${e.name}`)
          .setDescription(
            `**Muscle Group:** ${e.primaryMuscles}\n**Type:** ${e.mechanic}\n**Equipment:** ${e.equipment}\n**Difficulty:** ${e.category}}`
          )
          .setImage(e.image[0])
          .setColor(0xff865a) // Or one of Discord's predefined color names
          .setFooter({
            text: "You can create a profile using /pr",
          });

        interaction.reply({ embeds: [embed] });
      }
    });
  },
};
