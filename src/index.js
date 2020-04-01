const Monitor = require('icecast-monitor');
const IRC = require('irc-framework');

const monitor = new Monitor({
  host: 'radio.fam.wtf',
  port: 8000,
  user: 'admin',
  password: process.env.ICECAST_ADMIN_PASSWORD,
});

const client = new IRC.Client();

client.connect({
  host: 'irc.fam.wtf',
  port: 6667,
  nick: 'radiobot',
});

client.on('registered', () => {
  const channel = client.channel('#radio');

  channel.join();

  monitor.createFeed((err, feed) => {
    feed.on('mount.listeners', (mount, count) => {
      if (count > 0) {
        channel.say(`new listener count ${count}`);
      }
    });
  });
});
