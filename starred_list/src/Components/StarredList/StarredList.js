import React, { Component } from 'react';
import RepoEntry from '../RepoEntry/RepoEntry.js';
import './StarredList.css';

class StarredList extends Component {
    constructor() {
        super();
        this.state = {
            repoList: undefined,
            page: undefined,
            maxPage: undefined,
            empty: undefined,
        };
        this.saveFetchedData = this.saveFetchedData.bind(this);
        this.goBack = this.goBack.bind(this);
        this.goNext = this.goNext.bind(this);
    }

    componentDidMount() {
        this.setState({
            repoList: [],
            page: 1,
            maxPage: 34,
            empty: true,
        });
        this.getGithubRepos(this.state.page);
    }

    getGithubRepos = async(page) => {
        const today = new Date();
        const priorDate = new Date(today.setDate(today.getDate() - 30));
        const dateString = priorDate.getFullYear() + '-' + (priorDate.getMonth() + 1) + '-' + priorDate.getDate();
        let url = 'https://api.github.com/search/repositories?q=created:>' + dateString + '&sort=stars&order=desc';
        if (page > 1)
            url += '&page=' + page;
        const APICall = await fetch(url);
        const response = await APICall.json();
        this.saveFetchedData(response.items);

        // const maxPageSearch = 34;
        // for (let i = 1; i <= maxPageSearch; i++) {
        //     if (i > 1)
        //         url += '&page=' + i;
        //     const APICall = await fetch(url);
        //     const response = await APICall.json();
        //     if (response.items !== undefined)
        //         this.saveFetchedData(response.items);
        // }
        // while (!finishedFetching) {
        //     if (page > 1)
        //         url += '&page=' + page;
        //     const APICall = await fetch(url);
        //     const response = await APICall.json();
        //     this.saveFetchedData(response.items);
        //     if (response.items)
        // }

        
    }

    saveFetchedData(items) {
        let repoList = [];
        for (let i = 0; i < items.length; i++) {
            repoList.push({
                repoName: items[i].name,
                repoDescription: items[i].description,
                ownerName: items[i].owner.login,
                ownerAvatar: items[i].owner.avatar_url,
                starsCount: items[i].stargazers_count,
                issuesCount: items[i].open_issues_count,
                createdAt: items[i].created_at,
                repoUrl: items[i].html_url,
            });
        }
        this.setState({ repoList, empty: false });
        console.log(this.state.repoList);
    }

    goBack() {
        if (this.state.page > 1) {
            this.getGithubRepos(this.state.page - 1);
            this.setState({ page: this.state.page - 1 });
        }
    }

    goNext() {
        if (this.state.page < this.state.maxPage) {
            this.getGithubRepos(this.state.page + 1);
            this.setState({ page: this.state.page + 1 });
        }
    }

    render() {
        console.log(this.state);
        // let entryElement = undefined;
        let entryElements = undefined;
        let backButton = <button className="btnDisabled">Back</button>;
        let nextButton = <button className="btnDisabled">Next</button>;
        let pageNumber = undefined;

        if (this.state.empty !== undefined && !this.state.empty) {
            // const entry = this.state.repoList[0];
            // entryElement = (
            //     <RepoEntry
            //         repoName={entry.repoName}
            //         repoDescription={entry.repoDescription}
            //         ownerName={entry.ownerName}
            //         ownerAvatar={entry.ownerAvatar}
            //         starsCount={entry.starsCount}
            //         issuesCount={entry.issuesCount}
            //         createdAt={entry.createdAt}
            //         repoUrl={entry.repoUrl}
            //     />
            // );

            entryElements = this.state.repoList.map((entry) =>
                <RepoEntry
                    repoName={entry.repoName}
                    repoDescription={entry.repoDescription}
                    ownerName={entry.ownerName}
                    ownerAvatar={entry.ownerAvatar}
                    starsCount={entry.starsCount}
                    issuesCount={entry.issuesCount}
                    createdAt={entry.createdAt}
                    repoUrl={entry.repoUrl}
                    key={entry.repoName}
                />
            );

            pageNumber = this.state.page;
            if (pageNumber > 1)
                backButton = <button className="btn" onClick={this.goBack}>Back</button>;

            if (pageNumber < this.state.maxPage)
                nextButton = <button className="btn" onClick={this.goNext}>Next</button>;
        }
        return (
            <div className="page">
                <span className="title">Most starred repositories on GitHub the last 30 days:</span>
                <div className="list">
                    {entryElements}
                </div>
                <div className="pagination">
                    {backButton}
                    <span>{pageNumber}</span>
                    {nextButton}
                </div>
            </div>
        );
    }
  }
  
  export default StarredList;