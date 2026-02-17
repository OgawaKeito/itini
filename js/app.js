const { createApp, ref } = Vue;

createApp({
    setup() {
        const trip = ref({
            title: '',
            destination: '',
            start_date: '',
            end_date: ''
        });

        const loading = ref(false);
        const generatedUrl = ref(''); // ここにURLが入ると表示が切り替わる

        const createTrip = async () => {
            if (!trip.value.title || !trip.value.start_date) {
                alert('タイトルと開始日は必須です');
                return;
            }

            loading.value = true;
            try {
                // APIにデータを飛ばす（DB保存）
                const response = await axios.post('api/create_trip.php', trip.value);

                if (response.data.share_id) {
                    // 【修正点】勝手にジャンプ（href）せず、表示用のURLを生成するだけ
                    const baseUrl = window.location.href.split('index.html')[0];
                    generatedUrl.value = `${baseUrl}edit.html?id=${response.data.share_id}`;
                } else {
                    alert('発行に失敗しました');
                }
            } catch (error) {
                console.error(error);
                alert('サーバーとの通信に失敗しました');
            } finally {
                loading.value = false;
            }
        };

        const copyUrl = () => {
            const copyText = document.getElementById("urlInput");
            copyText.select();
            copyText.setSelectionRange(0, 99999);

            navigator.clipboard.writeText(copyText.value).then(() => {
                alert("URLをコピーしました！旅のしおりを始めましょう。");
            });
        };

        return {
            trip,
            loading,
            generatedUrl,
            createTrip,
            copyUrl
        };
    }
}).mount('#app');