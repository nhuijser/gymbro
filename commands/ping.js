const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Pong!")
      .setDescription(`🏓 ${client.ws.ping}ms`);

    if (client.ws.ping > 500) embed.setColor(0xff0000);
    else if (client.ws.ping > 250) embed.setColor(0xffff00);
    else embed.setColor(0x00ff00);

    await interaction.reply({ embeds: [embed] });
  },
};
