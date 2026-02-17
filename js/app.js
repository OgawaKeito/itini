const { createApp, ref } = Vue;

createApp({
    setup() {
        // デフォルトは1泊2日などをイメージして duration: 1
        const trip = ref({ title: '', destination: '', start_date: '', duration: '' });
        const generatedUrl = ref('');

        const createTrip = async () => {
            // バリデーション
            if (!trip.value.title || !trip.value.start_date || !trip.value.duration) {
                alert("タイトル、開始日、日数は必須です。");
                return;
            }

            try {
                // 日数から終了日を計算
                const start = new Date(trip.value.start_date);
                const days = parseInt(trip.value.duration);
                const end = new Date(start);
                end.setDate(start.getDate() + (days - 1));

                const payload = {
                    title: trip.value.title,
                    destination: trip.value.destination,
                    start_date: trip.value.start_date,
                    end_date: end.toISOString().split('T')[0] // YYYY-MM-DD
                };

                const res = await axios.post('api/create_trip.php', payload);

                if (res.data.share_id) {
                    // URL生成（遷移はしない）
                    const baseUrl = window.location.href.split('index.html')[0].split('?')[0];
                    // 末尾の/処理
                    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
                    generatedUrl.value = `${cleanBaseUrl}edit.html?id=${res.data.share_id}`;
                }
            } catch (e) {
                console.error(e);
                alert("作成に失敗しました。");
            }
        };

        const copyUrl = () => {
            const copyText = document.getElementById("urlInput");
            copyText.select();
            navigator.clipboard.writeText(copyText.value);
            alert("URLをコピーしました！");
        };

        return { trip, generatedUrl, createTrip, copyUrl };
    }
}).mount('#app');