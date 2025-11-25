import { Discord } from 'discord.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Método no permitido'});
    }

    const { sourceServerId, targetServerId } = req.body;
    const botToken = process.env.DISCORD_BOT_TOKEN; // Variable de entorno

    const client = new Discord.Client();
    client.login(botToken);

    try {
        const sourceGuild = await client.guilds.fetch(sourceServerId);
        const targetGuild = await client.guilds.fetch(targetServerId);

        // Clonar canales
        for (const channel of sourceGuild.channels.cache.values()) {
            await targetGuild.channels.create(channel.name, {
                type: channel.type,
                topic: channel.topic,
                nsfw: channel.nsfw,
                rateLimitPerUser: channel.rateLimitPerUser,
                parent: channel.parent ? targetGuild.channels.cache.get(channel.parent.id) : null,
                permissionOverwrites: channel.permissionOverwrites.cache.map(overwrite => ({
                    id: overwrite.id,
                    allow: overwrite.allow.bitfield,
                    deny: overwrite.deny.bitfield,
                    type: overwrite.type
                }))
            });
        }

        // Clonar roles
        for (const role of sourceGuild.roles.cache.values()) {
            await targetGuild.roles.create({
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                permissions: role.permissions,
                mentionable: role.mentionable
            });
        }

        res.status(200).json({message: 'Clonación completada'});
    } catch (error) {
        res.status(500).json({error: 'Error al clonar'});
    }
}
