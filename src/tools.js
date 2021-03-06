const tools = {
    getUsernameFromData: function(data) {
        if (data.indexOf(':tmi.twitch.tv') != -1) return null;
        const splitedData = data.split(':');
        if (splitedData.length < 3 || splitedData.length > 3) return null;
        const username = splitedData[1].split('!');
        return username[0];
    },

    getTextFromData: function(data) {
        const text = data.split(':')[2];
        return text
    }
}

module.exports = tools;