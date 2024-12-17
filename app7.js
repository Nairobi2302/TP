// Конфигурация пользователя (можно настроить, изменяя значение переменной)
var user = 'Иванов Иван'; // или var user = null, если пользователя нет

// Инициализация объектов данных (например, заказы)
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
    }
]);

// Класс View для отображения данных на странице
class View {
    constructor() {
        this.orderListContainer = document.getElementById('order-list-container');
        this.userNameElement = document.getElementById('user-name');
        this.userActionsElement = document.getElementById('user-actions');
    }

    // Отображение текущего пользователя
    renderUser() {
        this.userNameElement.innerHTML = user ? `Пользователь: ${user}` : 'Пользователь: не авторизован';
    }

    // Отображение списка заказов
    renderOrders(orders) {
        this.orderListContainer.innerHTML = ''; // Очистить текущий список
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('order-list');
            orderElement.innerHTML = `
                <div class="order">
                    <p>${order.description} (${order.author})</p>
                    <button onclick="removeOrder('${order.id}')">Удалить</button>
                    <button onclick="editOrder('${order.id}')">Редактировать</button>
                </div>
            `;
            this.orderListContainer.appendChild(orderElement);
        });
    }

    // Отображение кнопок для действий с заказами
    renderActions() {
        if (user) {
            this.userActionsElement.innerHTML = `
                <button onclick="addOrder()">Добавить заказ</button>
            `;
        } else {
            this.userActionsElement.innerHTML = '';
        }
    }
}

// Пример отображения данных при загрузке страницы
const view = new View();
view.renderUser();
view.renderOrders(objInf.getObjs());
view.renderActions();

// Функции для манипуляции данными и отображения изменений на странице
function addOrder() {
    const newOrder = {
        id: String(Math.random()),
        description: 'Новый заказ',
        createdAt: new Date(),
        author: user,
    };
    objInf.addObj(newOrder);
    view.renderOrders(objInf.getObjs());
}

function removeOrder(id) {
    objInf.removeObj(id);
    view.renderOrders(objInf.getObjs());
}

function editOrder(id) {
    const updatedOrder = { description: 'Отредактированное описание' };
    objInf.editObj(id, updatedOrder);
    view.renderOrders(objInf.getObjs());
}
