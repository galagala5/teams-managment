
module.exports = class BasicRepository {
    constructor() { }

    add(data) {
    return Promise.reject(new Error(`${this.constructor.name} not implemented`));
    }

    update(data) {
    return Promise.reject(new Error(`${this.constructor.name} not implemented`));
    }

    deleteById(data) {
    return Promise.reject(new Error(`${this.constructor.name} not implemented`));
    }

    softDeleteById(data) {
    return Promise.reject(new Error(`${this.constructor.name} not implemented`));
    }

    getById(id) {
    return Promise.reject(new Error(`${this.constructor.name} not implemented`));
    }

    getByEmail(email) {
    return Promise.reject(new Error(`${this.constructor.name} not implemented`));
    }

    getAll() {
    return Promise.reject(new Error(`${this.constructor.name} not implemented`));
    }

};