
const GanttCommon = {

  getMinYear: (items: any) => {
    try{    
      const target = []
      items.forEach((element) => {
        target.push(element.start_date)

      });
      console.log(target)
      //const dates = ["2026-04-01", "2024-03-01", "2021-01-01"];
      const dates = target;

      // 各日付をタイムスタンプ（数値）に変換して、最小値を取得
      const oldestTimestamp = Math.min(...dates.map(date => new Date(date)));

      // 数値から YYYY-MM-DD の文字列に戻す
      const oldestDate = new Date(oldestTimestamp).toISOString().split('T')[0];

      console.log(oldestDate); // 出力: "2021-01-01"
      return oldestDate;
    } catch (error) {
      console.log(error)
    }

  },

}
export default GanttCommon;

