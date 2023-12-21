const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator, songValidator }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator, songValidator);
    server.route(routes(playlistsHandler));
  },
};
