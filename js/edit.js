const { createApp, ref, onMounted, computed } = Vue;

createApp({
    setup() {
        // --- 状態管理データ ---
        const trip = ref(null);
        const activities = ref([]);
        const totalDays = ref(1);
        const shareId = new URLSearchParams(window.location.search).get('id');

        // 新規追加用
        const newAct = ref({
            day_number: 1,
            start_time: '',
            activity_name: '',
            location: '',
            memo: ''
        });

        // 編集用
        const isEditing = ref(false);
        const editingActivity = ref({});

        // ★アコーディオン開閉フラグ
        const isExpanded = ref(false);

        // ★画面に表示するアクティビティを計算 (8件制限ロジック)
        const displayedActivities = computed(() => {
            // 開いている、または全部で8件以下なら、全て表示
            if (isExpanded.value || activities.value.length <= 8) {
                return activities.value;
            }
            // 閉じているなら、最初の8件だけを切り出す
            return activities.value.slice(0, 8);
        });

        // --- データ読み込み (キャッシュ回避付き) ---
        const loadData = async () => {
            if (!shareId) return;
            try {
                // ?t=... をつけてブラウザに新しいデータだと認識させる
                const res = await axios.get(`api/get_trip.php?id=${shareId}&t=${new Date().getTime()}`);
                trip.value = res.data.trip;
                activities.value = res.data.activities;

                // 日数計算
                const start = new Date(trip.value.start_date);
                const end = new Date(trip.value.end_date);
                totalDays.value = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            } catch (e) {
                console.error("Load Error:", e);
            }
        };

        // --- 新規追加 ---
        const addActivity = async () => {
            if (!newAct.value.activity_name || !newAct.value.start_time) {
                alert("時間と内容は必須です");
                return;
            }

            try {
                // 保存完了を待つ
                await axios.post('api/add_activity.php', {
                    share_id: shareId,
                    ...newAct.value
                });
                
                // フォームのリセット (日数は維持)
                const currentDay = newAct.value.day_number;
                newAct.value = {
                    day_number: currentDay,
                    start_time: '',
                    activity_name: '',
                    location: '',
                    memo: ''
                };
                
                await loadData(); // 最新データを再取得
            } catch (e) {
                alert("追加に失敗しました");
            }
        };

        // --- 削除 ---
        const deleteActivity = async (id) => {
            if (!confirm("本当に削除しますか？")) return;
            try {
                await axios.post('api/delete_activity.php', { id: id });
                await loadData();
            } catch (e) {
                alert("削除に失敗しました");
            }
        };

        // --- 編集モーダルを開く ---
        const openEditModal = (act) => {
            editingActivity.value = { ...act };
            isEditing.value = true;
        };

        // --- 更新実行 ---
        const updateActivity = async () => {
            try {
                await axios.post('api/update_activity.php', editingActivity.value);
                isEditing.value = false;
                await loadData();
            } catch (e) {
                alert("更新に失敗しました");
            }
        };

        onMounted(loadData);

        return {
            trip, activities, totalDays, newAct,
            addActivity, deleteActivity, openEditModal, updateActivity,
            isEditing, editingActivity,
            // 追加: アコーディオン用
            isExpanded, displayedActivities
        };
    }
}).mount('#app');