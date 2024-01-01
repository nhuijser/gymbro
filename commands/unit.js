const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { AttachmentBuilder } = require("discord.js");
const getDatabase = require("../database/database").getDatabase;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unit")
    .setDescription("Set your preferred unit so your lifts are readable")
    .addStringOption((option) =>
      option
        .setName("unit")
        .setDescription("The unit you want to set")
        .setRequired(true)
        .addChoices(
          { name: "🏋️ kg", value: "kg" },
          { name: "🏋️ lbs", value: "lbs" }
        )
    ),

  async execute(interaction) {
    const unit = interaction.options.getString("unit");

    const database = getDatabase();

    const userId = interaction.user.id;
    const user = database
      .prepare("SELECT * FROM profiles WHERE id = ?")
      .get(userId);

    if (user) {
      database
        .prepare(`UPDATE profiles SET unit = ? WHERE id = ?`)
        .run(unit, userId);
    } else {
      database
        .prepare(
          "INSERT INTO profiles (id, bench, squat, deadlift, unit) VALUES (?, ?, ?, ?, ?)"
        )
        .run(userId, null, null, null, unit);
    }

    const embed = new EmbedBuilder()
      .setTitle("🏆 Unit Set!")

      .setDescription(
        `You set your preferred unit to **${unit}**\nPlease consider checking your PR's and making sure they're correct!`
      )

      .setColor(0xff865a) // Or one of Discord's predefined color names
      .setFooter({
        text: "You can change this anytime using /unit",
      });

    await interaction.reply({ embeds: [embed] });
  },
};
