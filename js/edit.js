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

        // アコーディオン開閉フラグ
        const isExpanded = ref(false);

        // 日ごとのフィルタリング状態（初期値はすべて表示）
        const selectedDay = ref('all');

        // 選択された日に応じてアクティビティを絞り込む
        const filteredActivities = computed(() => {
            if (selectedDay.value === 'all') {
                return activities.value;
            }
            return activities.value.filter(act => parseInt(act.day_number) === parseInt(selectedDay.value));
        });

        // 画面に表示するアクティビティを filteredActivities ベースに変更
        const displayedActivities = computed(() => {
            const baseList = filteredActivities.value;
            // 開いている、または全部で8件以下なら、全て表示
            if (isExpanded.value || baseList.length <= 8) {
                return baseList;
            }
            // 閉じているなら、最初の8件だけを切り出す
            return baseList.slice(0, 8);
        });

        // --- データ読み込み (キャッシュ回避付き) ---
        const loadData = async () => {
            if (!shareId) return;
            try {
                // ?t=... をつけてブラウザに新しいデータだと認識させる
                const res = await axios.get(`api/get_trip.php?id=${shareId}&t=${new Date().getTime()}`);
                trip.value = res.data.trip;
                activities.value = res.data.activities;

                // ★追加：ブラウザのタブ（タイトル）を旅行名に動的に変更する
                if (trip.value && trip.value.title) {
                    document.title = `${trip.value.title} | Itini`;
                }

                // 日数計算
                const start = new Date(trip.value.start_date);
                const end = new Date(trip.value.end_date);
                totalDays.value = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            } catch (e) {
                console.error("Load Error:", e);
                Swal.fire({
                    icon: 'error',
                    title: '読み込みエラー',
                    text: 'データの取得に失敗しました。',
                    confirmButtonColor: '#5c6bc0'
                });
            }
        };

        const formatMemo = (text) => {
            if (!text) return '';
            
            // 1. セキュリティ対策（HTMLタグを無効化）
            let escaped = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');

            // 2. URLを検知して <a> タグに変換
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            let linked = escaped.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="memo-link">$1</a>');

            // 3. 改行コードを <br> に変換して返す
            return linked.replace(/\n/g, '<br>');
        };

        // --- 新規追加 ---
        const addActivity = async () => {
            if (!newAct.value.activity_name || !newAct.value.start_time) {
                Swal.fire({
                    icon: 'warning',
                    title: '入力エラー',
                    text: '「時間」と「内容」は必須項目です。',
                    confirmButtonColor: '#5c6bc0'
                });
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
                Swal.fire({
                    icon: 'error',
                    title: 'エラー',
                    text: '予定の追加に失敗しました。',
                    confirmButtonColor: '#5c6bc0'
                });
            }
        };

        // --- 削除 ---
        const deleteActivity = async (id) => {
            // お洒落な確認ダイアログ
            const result = await Swal.fire({
                title: '本当に削除しますか？',
                text: 'この操作は元に戻せません。',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef5350', // 削除は目立つように赤
                cancelButtonColor: '#7986cb',  // キャンセルは薄い藍色
                confirmButtonText: '削除する',
                cancelButtonText: 'キャンセル'
            });

            // キャンセルされたらここで処理終了
            if (!result.isConfirmed) return;

            try {
                await axios.post('api/delete_activity.php', { id: id });
                await loadData();
                
                Swal.fire({
                    icon: 'success',
                    title: '削除しました',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'エラー',
                    text: '削除に失敗しました。',
                    confirmButtonColor: '#5c6bc0'
                });
            }
        };

        // --- 編集モーダルを開く ---
        const openEditModal = (act) => {
            editingActivity.value = { ...act };
            isEditing.value = true;
        };

        // --- 更新実行 ---
        const updateActivity = async () => {
            if (!editingActivity.value.activity_name || !editingActivity.value.start_time) {
                Swal.fire({
                    icon: 'warning',
                    title: '入力エラー',
                    text: '「時間」と「内容」は必須項目です。',
                    confirmButtonColor: '#5c6bc0'
                });
                return;
            }

            try {
                await axios.post('api/update_activity.php', editingActivity.value);
                isEditing.value = false;
                await loadData();
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'エラー',
                    text: '更新に失敗しました。',
                    confirmButtonColor: '#5c6bc0'
                });
            }
        };

        onMounted(loadData);

        return {
            trip, activities, totalDays, newAct,
            addActivity, deleteActivity, openEditModal, updateActivity,
            isEditing, editingActivity,
            isExpanded, displayedActivities,
            selectedDay, filteredActivities,formatMemo
        };
    }
}).mount('#app');