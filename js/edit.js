const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        // データ保持用
        const trip = ref(null);
        const activities = ref([]);
        const totalDays = ref(1);
        const shareId = new URLSearchParams(window.location.search).get('id');

        // 新規追加フォーム用データ
        const newAct = ref({
            day_number: 1,
            start_time: '',
            activity_name: '',
            location: '', // 行き先を追加
            memo: ''
        });

        // 編集モード用データ
        const isEditing = ref(false);
        const editingActivity = ref({});

        // --- データ読み込み ---
        const loadData = async () => {
            if (!shareId) return;
            try {
                const res = await axios.get(`api/get_trip.php?id=${shareId}`);
                trip.value = res.data.trip;
                activities.value = res.data.activities;

                // 日数の計算
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
                await axios.post('api/add_activity.php', {
                    share_id: shareId,
                    ...newAct.value
                });
                
                // フォームのリセット（入力しやすいように日数は維持、他はクリア）
                const currentDay = newAct.value.day_number;
                newAct.value = {
                    day_number: currentDay,
                    start_time: '',
                    activity_name: '',
                    location: '',
                    memo: ''
                };
                
                await loadData(); // リスト更新
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
            // 元データを直接いじらないようコピーを作成
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
            trip,
            activities,
            totalDays,
            newAct,
            addActivity,
            // 追加機能
            deleteActivity,
            openEditModal,
            updateActivity,
            isEditing,
            editingActivity
        };
    }
}).mount('#app');