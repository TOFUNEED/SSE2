export class Station {
    constructor({ id, name_jp, order }) {
        if (!id || !name_jp || order === undefined) {
            throw new Error('Station requires id, name_jp, and order.');
        }
        
        this.id = id;
        this.name_jp = name_jp;
        this.order = order;
    }
}