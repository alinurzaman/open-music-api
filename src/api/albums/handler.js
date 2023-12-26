const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    album.songs = await this._service.getSongsByAlbumId(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.getAlbumById(id);
    await this._service.likeAlbum(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil like album',
    });
    response.code(201);
    return response;
  }

  async deleteLikeAlbumByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.unlikeAlbum(id, credentialId);

    return {
      status: 'success',
      message: 'Berhasil unlike album',
    };
  }

  async getLikesAlbumByIdHandler(request, h) {
    const { id } = request.params;

    try {
      const likes = await this._service.getLikesFromCache(id);
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      })
        .header('X-Data-Source', 'cache');

      return response;
    } catch (error) {
      const likes = await this._service.getLikes(id);

      return {
        status: 'success',
        data: {
          likes,
        },
      };
    }
  }
}

module.exports = AlbumsHandler;
