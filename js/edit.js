const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const trip = ref(null);
        const activities = ref([]);
        const newActivity = ref({
            start_time: '',
            activity_name: '',
            memo: ''
        });

        // URLからIDを取得
        const urlParams = new URLSearchParams(window.location.search);
        const shareId = urlParams.get('id');

        const loadTripData = async () => {
            try {
                const response = await axios.get(`api/get_trip.php?id=${shareId}`);
                trip.value = response.data.trip;
                activities.value = response.data.activities;
            } catch (error) {
                console.error('読み込み失敗');
            }
        };

        const addActivity = async () => {
            // ここに保存処理を書く（次回実装）
            activities.value.push({ ...newActivity.value });
            newActivity.value = { start_time: '', activity_name: '', memo: '' };
        };

        onMounted(loadTripData);

        return { trip, activities, newActivity, addActivity };
    }
}).mount('#app');