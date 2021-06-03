// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/dev.send");

// ----------
// Blacklist
// ----------

module.exports.blacklist = function blacklist (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Blacklist");

   const serverID = data.cmd.params.split(" ")[0].toLowerCase();

   return db.blacklist(
      serverID,
      async function error (err)
      {

         if (err)
         {

            return logger("error", err, "command", data.message.channel.guild.name);

         }


         const target = data.client.guilds.cache.get(serverID);
         if (!target)
         {

            data.color = "warn";
            data.text = `${`:regional_indicator_x:  **${serverID} Blacklisted**\n`}`;

         }
         else if (target.owner)
         {

            data.color = "warn";
            data.text = `${`:regional_indicator_x:  **${target.name} Blacklisted**\nThe server owner has been notified\n` +
            "```md\n> "}${target.id}\n@${target.owner.user.username}#${
               target.owner.user.discriminator}\n${target.memberCount} members\n\`\`\``;
            data.title = "Server Blacklisted";

            const writeErr = `One of your server's - ${target.name} has been Blacklisted. If you wish to appeal then please join our discord server and speak to an admin: https://discord.gg/mgNR64R`;

            // ----------------------
            // Send message to owner
            // ----------------------

            target.owner.
               send(writeErr).
               catch((err) => console.log(
                  "error",
                  err,
                  "warning",
                  target.name
               ));
            console.log(`${serverID}`);
            await target.leave();

         }
         else
         {

            data.color = "warn";
            data.text = `${`:regional_indicator_x:  **${target.name} Blacklisted**\nUnable to notify the server owner\n` +
            "```md\n> "}${target.id}\n${target.memberCount} members\n\`\`\``;
            data.title = "Server Blacklisted";
            await target.leave();


         }

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
   );

};

module.exports.check = function check (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Check Blacklist");

   // eslint-disable-next-line no-unused-vars
   const serverID = data.cmd.params.split(" ")[0].toLowerCase();

   db.getServerInfo(
      serverID,
      function getServerInfo (server)
      {

         const blacklistedResult = `\`\`\`Server: ${serverID}\nBlacklist Status: ${server[0].blacklisted}\n\n\`\`\``;

         data.text = `${blacklistedResult}\n\n`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
   );

};