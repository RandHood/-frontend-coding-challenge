import './RepoEntry.css';

function RepoEntry(props) {
    const date1 = new Date();
    const date2 = new Date(props.createdAt);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let starsCount = props.starsCount;
    if (starsCount >= 1000) {
        starsCount = Math.floor(starsCount / 100);
        starsCount /= 10;
        starsCount += 'k';
    }
    let issuesCount = props.issuesCount;
    if (issuesCount >= 1000) {
        issuesCount = Math.floor(issuesCount / 100);
        issuesCount /= 10;
        issuesCount += 'k';
    }

    return (
      <div className="entry">
          <img className="avatar" src={props.ownerAvatar} />
          <div className="infoContainer">
            <span className="repoName">{props.repoName}</span> 
            <br/>
            <span className="repoDescription">{props.repoDescription}</span>
            <br/>

            <div className="counterContainer">
                <div className="starsCounter">
                    <span> Stars: {starsCount}</span>
                </div>
                <div className="issuesCounter">
                    <span> Issues: {issuesCount}</span>
                </div>
                <span className="date">Submitted {diffDays} days ago by {props.ownerName}</span>
            </div>
          </div>
      </div>
    );
  }
  
  export default RepoEntry;