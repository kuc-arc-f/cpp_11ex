import moment from 'moment';

const LibCommon = {

  /**
  * textToLink: URL文字を A tagに変換
  * @param
  *
  * @return string | null
  */   
  textToLink: function(comment: string): string
  {
      try{
      // 正規表現でURLを抽出
      const regexp_url = /(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/g;
//      let linkedComment = comment.replace(regexp_url, '<a href="$1">$1</a>');
      let linkedComment = comment.replace(regexp_url, '<a href="$1" target="_blank">$1</a>');
      // 正規表現で#を抽出
      const regexp_hash = /#+([a-zA-Z0-9亜-熙ぁ-んァ-ヶー-龥朗-鶴.\-_]+)/g;
      linkedComment = linkedComment.replace(
      regexp_hash,
      '<a href="/search?q=$1&type=hash">#$1</a>'
      );
      // 正規表現で@を抽出
      const regexp_at = /@+([a-zA-Z0-9亜-熙ぁ-んァ-ヶー-龥朗-鶴.\-_]+)/g;
      linkedComment = linkedComment.replace(
      regexp_at,
      '<a href="/search?q=$1&type=at">@$1</a>'
      );
      return linkedComment;    
    } catch (e) {
      console.log(e);
      throw new Error('error, textToLink');
    }
  },  
  /**
  * replaceBrString
  * @param
  *
  * @return string | null
  */ 
  replaceBrString: function(value: string): string
  {
    try{
      if(typeof(value) === 'undefined'){
        return "";
      }
      let contentValue = value;
      contentValue = contentValue.replace(/\r?\n/g, '\n');
      contentValue = contentValue.replace(/\n/g, '<br />\n');
      contentValue = this.textToLink(contentValue);
      return contentValue;
    } catch (e) {
      console.log(e);
      throw new Error('error, replaceBrString');
    }
  },
}
export default LibCommon
