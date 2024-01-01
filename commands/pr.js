const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { AttachmentBuilder } = require("discord.js");
const getDatabase = require("../database/database").getDatabase;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("pr")
    .setDescription("🏆 Set your 1RM to show off on your profile")
    .addStringOption((option) =>
      option
        .setName("excercise")
        .setDescription("The excercise you want to set")
        .setRequired(true)
        .addChoices(
          { name: "🏋️ Bench Press", value: "bench" },
          { name: "🏋️ Squat", value: "squat" },
          { name: "🏋️ Deadlift", value: "deadlift" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("weight")
        .setDescription("The weight you want to set")

        .setRequired(true)
    ),

  async execute(interaction) {
    const excercise = interaction.options.getString("excercise");
    const weight = interaction.options.getNumber("weight");

    const database = getDatabase();

    const userId = interaction.user.id;
    const user = database
      .prepare("SELECT * FROM profiles WHERE id = ?")
      .get(userId);

    if (user) {
      database
        .prepare(`UPDATE profiles SET ${excercise} = ? WHERE id = ?`)
        .run(weight, userId);
    } else {
      database
        .prepare(
          "INSERT INTO profiles (id, bench, squat, deadlift) VALUES (?, ?, ?, ?)"
        )
        .run(userId, null, null, null);
      database
        .prepare(`UPDATE profiles SET ${excercise} = ? WHERE id = ?`)
        .run(weight, userId);
    }

    const embed = new EmbedBuilder()
      .setTitle("🏆 Personal Record Set!")

      .setDescription(
        `You set your **${excercise}** personal record to **${weight}**${
          user?.unit ?? "kg"
        }`
      )

      .setColor(0x00ff00)
      .setFooter({
        text: "You can change this anytime using /pr",
      });

    await interaction.reply({ embeds: [embed] });
  },
};
