import { db } from '../../config/firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { TrainFactory } from '../../domain/services/TrainFactory.js';
import { Train } from '../../domain/models/Train.js';

export class FirebaseRepository {

    /**
     * Firestoreから全ての駅データを取得し、Stationモデルの配列として返す
     * @returns {Promise<import('../../domain/models/Station.js').Station[]>}
     */
    async fetchAllStations() {
        const stationsCollection = collection(db, "stations");
        const q = query(stationsCollection, orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        
        const stationDocs = [];
        snapshot.forEach(doc => {
            stationDocs.push({ id: doc.id, ...doc.data() });
        });

        return TrainFactory.createStations(stationDocs);
    }

    /**
     * Firestoreから全ての列車のIDと方面を取得する
     * @returns {Promise<{id: string, direction: string}[]>}
     */
    async fetchAllTrainIds() {
        const trainsCollection = collection(db, "trains");
        const snapshot = await getDocs(trainsCollection);
        
        const trains = [];
        snapshot.forEach(doc => {
            trains.push({
                id: doc.id,
                direction: doc.data().direction
            });
        });

        return trains.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    }

    /**
     * 特定の列車データをFirestoreから取得し、Trainモデルとして返す
     * @param {string} trainId - 取得したい列車の番号
     * @returns {Promise<Train | null>} 列車データオブジェクト、存在しない場合はnull
     */
    async findTrainById(trainId) {
        const trainDocRef = doc(db, "trains", trainId);
        const trainDocSnap = await getDoc(trainDocRef);

        if (trainDocSnap.exists()) {
            return TrainFactory.createFromFirestore(trainDocSnap.data());
        } else {
            return null;
        }
    }

    /**
     * TrainモデルをFirestoreに保存（新規作成または上書き）する
     * @param {Train} train - 保存するTrainモデルインスタンス
     */
    async saveTrain(train) {
        if (!(train instanceof Train)) {
            throw new Error("Argument must be an instance of Train.");
        }
        const trainDocRef = doc(db, "trains", train.id);
        const plainObject = train.toPlainObject();
        await setDoc(trainDocRef, plainObject);
    }

    /**
     * 列車データをFirestoreから完全に削除する
     * @param {string} trainId - 削除する列車の番号
     */
    async deleteTrain(trainId) {
        const trainDocRef = doc(db, "trains", trainId);
        await deleteDoc(trainDocRef);
    }
}