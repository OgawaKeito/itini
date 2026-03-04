const { createApp, ref } = Vue;

createApp({
    setup() {
        const trip = ref({ title: '', destination: '', start_date: '', duration: '' });
        const generatedUrl = ref('');

        const createTrip = async () => {
            // バリデーション（SweetAlert2に変更）
            if (!trip.value.title || !trip.value.start_date || !trip.value.duration) {
                Swal.fire({
                    icon: 'warning',
                    title: '必須項目が未入力です',
                    text: 'タイトル、開始日、日数をすべて入力してください。',
                    confirmButtonColor: '#5c6bc0' // Itiniの藍色
                });
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
                    end_date: end.toISOString().split('T')[0]
                };

                const res = await axios.post('api/create_trip.php', payload);

                if (res.data.share_id) {
                    const baseUrl = window.location.href.split('index.html')[0].split('?')[0];
                    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
                    generatedUrl.value = `${cleanBaseUrl}edit.html?id=${res.data.share_id}`;
                    
                    // しおり完成通知
                    Swal.fire({
                        icon: 'success',
                        title: 'しおりが完成しました！',
                        text: 'URLをコピーして、旅のメンバーに共有しましょう。',
                        confirmButtonColor: '#5c6bc0'
                    });
                }
            } catch (e) {
                console.error(e);
                Swal.fire({
                    icon: 'error',
                    title: '通信エラー',
                    text: 'しおりの作成に失敗しました。',
                    confirmButtonColor: '#5c6bc0'
                });
            }
        };

        const copyUrl = () => {
            const copyText = document.getElementById("urlInput");
            copyText.select();
            navigator.clipboard.writeText(copyText.value);
            
            // コピー完了通知（自動で閉じるトースト風）
            Swal.fire({
                icon: 'success',
                title: 'コピー完了！',
                text: 'URLをクリップボードにコピーしました。',
                timer: 2000,
                showConfirmButton: false
            });
        };

        return { trip, generatedUrl, createTrip, copyUrl };
    }
}).mount('#app');