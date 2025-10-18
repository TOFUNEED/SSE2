import { EventBus } from './EventBus.js';
import { AppState } from '../state/AppState.js';
import { FirebaseRepository } from '../infrastructure/services/FirebaseRepository.js';
import * as config from '../config/trainData.js';
import * as mutations from '../state/mutations.js';

import { SearchBox } from '../ui/components/SearchBox.js';
import { TrainList } from '../ui/components/TrainList.js';
import { Editor } from '../ui/components/Editor/Editor.js';

import { LoadAllTrainIds } from '../usecases/LoadAllTrainIds.js';
import { LoadTrainForEditing } from '../usecases/LoadTrainForEditing.js';
import { SaveCurrentTrain } from '../usecases/SaveCurrentTrain.js';
import { DeleteCurrentTrain } from '../usecases/DeleteCurrentTrain.js';

export class App {
    constructor() {
        this.eventBus = new EventBus();
        this.state = new AppState(this.eventBus);
        this.repository = new FirebaseRepository();

        this.initComponents();
        this.registerUseCases();
    }

    initComponents() {
        this.components = {
            searchBox: new SearchBox(this.eventBus),
            trainList: new TrainList(this.eventBus, this.state),
            editor: new Editor(this.eventBus, this.state),
        };
    }

    registerUseCases() {
        const dependencies = {
            eventBus: this.eventBus,
            state: this.state,
            repository: this.repository,
            config: config,
        };

        this.useCases = {
            loadAllTrainIds: new LoadAllTrainIds(dependencies),
            loadTrainForEditing: new LoadTrainForEditing(dependencies),
            saveCurrentTrain: new SaveCurrentTrain(dependencies),
            deleteCurrentTrain: new DeleteCurrentTrain(dependencies),
        };
        
        this.eventBus.subscribe('search:request', (trainId) => this.useCases.loadTrainForEditing.execute(trainId));
        this.eventBus.subscribe('train:select', (trainId) => this.useCases.loadTrainForEditing.execute(trainId));
        this.eventBus.subscribe('train:save', () => this.useCases.saveCurrentTrain.execute());
        this.eventBus.subscribe('train:delete', () => this.useCases.deleteCurrentTrain.execute());
    }
    
    async start() {
        try {
            const allStations = await this.repository.fetchAllStations();
            mutations.setAllStations(this.state, allStations);
            await this.useCases.loadAllTrainIds.execute();
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.eventBus.publish('ui:show-notification', { message: '初期データの読み込みに失敗しました。', type: 'error' });
        }
    }
}