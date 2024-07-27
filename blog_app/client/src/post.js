import {formatISO9075} from "date-fns";
import { Link } from "react-router-dom";

export default function Post({title,summary,cover,content,createdAt,author}){

    return(
        <div className="post">
        <div className="image">
        <Link to = {'/post/id'}>
          <img src={'http://localhost:4000/'+cover} alt="" />
        </Link>
        </div>
        <div className="texts">
        <h2>{title}</h2>
        <p className="info">
          <a href = "/" className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className = "summary">{summary}</p>
        </div>
      </div>
    );
}