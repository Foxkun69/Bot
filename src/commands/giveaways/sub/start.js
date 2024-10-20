const { ChannelType } = require("discord.js");

/**
 * @param {import('discord.js').GuildMember} member - Thành viên trong guild
 * @param {import('discord.js').GuildTextBasedChannel} giveawayChannel - Kênh văn bản để tổ chức giveaway
 * @param {number} duration - Thời gian của giveaway (tính bằng mili giây)
 * @param {string} prize - Phần thưởng của giveaway
 * @param {number} winners - Số lượng người chiến thắng
 * @param {import('discord.js').User} [host] - Người tổ chức giveaway (mặc định là người dùng khởi tạo)
 * @param {string[]} [allowedRoles] - Các role được phép tham gia giveaway
 */
module.exports = async (member, giveawayChannel, duration, prize, winners, host, allowedRoles = []) => {
  try {
    if (!host) host = member.user; // Nếu không có host, mặc định là thành viên tạo giveaway
    if (!member.permissions.has("ManageMessages")) {
      return "Bạn cần quyền quản lý tin nhắn để bắt đầu giveaway.";
    }

    if (!giveawayChannel.type === ChannelType.GuildText) {
      return "Bạn chỉ có thể bắt đầu giveaway trong các kênh văn bản.";
    }

    /**
     * @type {import("discord-giveaways").GiveawayStartOptions}
     */
    const options = {
      duration: duration, // Thời gian của giveaway
      prize, // Phần thưởng
      winnerCount: winners, // Số lượng người chiến thắng
      hostedBy: host, // Người tổ chức
      thumbnail: "https://i.imgur.com/r0xkIFq.gif", // Ảnh thumbnail của giveaway
      messages: {
        giveaway: "<a:Giveaway:1293099995213594656>  **GIVEAWAY** <a:Giveaway:1293099995213594656> ",
        giveawayEnded: "<a:Giveaway:1293099995213594656>  **GIVEAWAY ĐÃ KẾT THÚC** <a:Giveaway:1293099995213594656> ",
        inviteToParticipate: "Phản ứng với <a:Giveaway:1293099995213594656> để tham gia",
        dropMessage: "Hãy là người đầu tiên phản ứng với <a:Giveaway:1293099995213594656> để giành chiến thắng!",
        hostedBy: `\n <a:thekings:1293113386439147582> Được tổ chức bởi: ${host.username}`,
      },
    };

    if (allowedRoles.length > 0) {
      options.exemptMembers = (member) => !member.roles.cache.find((role) => allowedRoles.includes(role.id));
      // Loại trừ các thành viên không có role cho phép tham gia
    }

    await member.client.giveawaysManager.start(giveawayChannel, options);
    return `Giveaway đã bắt đầu trong ${giveawayChannel}`;
  } catch (error) {
    member.client.logger.error("Giveaway Start", error);
    return `Đã xảy ra lỗi khi bắt đầu giveaway: ${error.message}`;
  }
};
