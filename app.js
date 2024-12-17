class ObjInfManager {
    
    #objs;

    constructor(objs = []) {
        this.#objs = objs;
    }

    getObjs(skip = 0, top = 10, filterConfig = {}) {
        let result = [...this.#objs];

        // Apply filters
        for (const [key, value] of Object.entries(filterConfig)) {
            result = result.filter(obj => obj[key] === value);
        }

        // Sort by date (newest first)
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        return result.slice(skip, skip + top);
    }

    getObj(id) {
        return this.#objs.find(obj => obj.id === id) || null;
    }

    validateObj(obj) {
        if (!obj.id || typeof obj.id !== 'string') return false;
        if (!obj.description || typeof obj.description !== 'string' || obj.description.length > 200) return false;
        if (!obj.createdAt || !(obj.createdAt instanceof Date)) return false;
        if (!obj.author || typeof obj.author !== 'string' || obj.author.trim() === '') return false;
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
        
        // Ensure we do not modify immutable fields
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

const objInf = new ObjInfManager([
    {
        id: '1',
        description: 'Новости ФПМИ',
        createdAt: new Date('2021-03-05T23:00:00'),
        author: 'Иванов Иван',
        photoLink: 'http://fpmi.bsu.by/ImgFpmi/Cache/banner_61403.jpg'
    },
    {
        id: '2',
        description: 'Обновление системы доставки',
        createdAt: new Date('2022-06-10T14:30:00'),
        author: 'Петров Петр'
    },
    {
        id: '3',
        description: 'Специальное предложение для клиентов',
        createdAt: new Date('2023-08-21T09:15:00'),
        author: 'Сидоров Сидор',
        photoLink: 'https://example.com/image.jpg'
    },
        // Добавлено ещё 17 объектов
    ...Array.from({ length: 17 }, (_, i) => ({
        id: (i + 4).toString(),
        description: `Описание объекта ${i + 4}`,
        createdAt: new Date(`2023-10-${(i % 30) + 1}T12:00:00`),
        author: `Автор ${i + 4}`,
        photoLink: i % 2 === 0 ? `https://example.com/image${i + 4}.jpg` : undefined
    }))
]);

// Пример проверки работы методов
console.log('Все объекты:', objInf.getObjs());
console.log('Получить объект по ID = 2:', objInf.getObj('2'));
console.log('Добавить новый объект:', objInf.addObj({
    id: '21',
    description: 'Тестовый объект',
    createdAt: new Date(),
    author: 'Тест Автор'
}));
console.log('Изменить описание объекта с ID = 2:', objInf.editObj('2', { description: 'Новое описание' }));
console.log('Удалить объект с ID = 1:', objInf.removeObj('1'));
console.log('Текущие объекты:', objInf.getObjs());
