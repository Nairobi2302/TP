class ObjInfManager {
    #objs;

    constructor(objs = []) {
        this.#objs = objs;
    }

    getObjs(skip = 0, top = 10, filterConfig = {}) {
        let result = [...this.#objs];
        for (const [key, value] of Object.entries(filterConfig)) {
            result = result.filter(obj => obj[key] === value);
        }
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return result.slice(skip, skip + top);
    }

    getObj(id) {
        return this.#objs.find(obj => obj.id === id) || null;
    }

    validateObj(obj) {
        if (!obj.id || typeof obj.id !== 'string') return false;
        if (!obj.description || typeof obj.description !== 'string') return false;
        if (!obj.createdAt || !(obj.createdAt instanceof Date)) return false;
        if (!obj.author || typeof obj.author !== 'string') return false;
        return true;
    }

    addObj(obj) {
        if (this.validateObj(obj)) {
            this.#objs.push(obj);
            return true;
        }
        return false;
    }

    editObj(id, updatedFields) {
        const objIndex = this.#objs.findIndex(obj => obj.id === id);
        if (objIndex === -1) return false;
        const objToUpdate = this.#objs[objIndex];
        const updatedObj = { ...objToUpdate, ...updatedFields };
        updatedObj.id = objToUpdate.id;
        updatedObj.author = objToUpdate.author;
        updatedObj.createdAt = objToUpdate.createdAt;
        if (this.validateObj(updatedObj)) {
            this.#objs[objIndex] = updatedObj;
            return true;
        }
        return false;
    }

    removeObj(id) {
        const initialLength = this.#objs.length;
        this.#objs = this.#objs.filter(obj => obj.id !== id);
        return this.#objs.length < initialLength;
    }

    addAll(objs) {
        const invalidObjs = [];
        objs.forEach(obj => {
            if (!this.addObj(obj)) {
                invalidObjs.push(obj);
            }
        });
        return invalidObjs;
    }

    clear() {
        this.#objs = [];
    }
}
