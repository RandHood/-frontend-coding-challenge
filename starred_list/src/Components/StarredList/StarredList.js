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
            isLoading: undefined,
            loading: undefined,
        };
        this.saveFetchedData = this.saveFetchedData.bind(this);
        this.goBack = this.goBack.bind(this);
        this.goNext = this.goNext.bind(this);
        this.enableLoading = this.enableLoading.bind(this);
        this.disableLoading = this.disableLoading.bind(this);
    }

    componentDidMount() {
        this.setState({
            repoList: [],
            page: 1,
            maxPage: 34,
            empty: true,
            isLoading: true,
            loading: <div className="loading">Loading...</div>,
        });
        this.getGithubRepos(this.state.page);
    }

    getGithubRepos = async(page) => {
        const today = new Date();
        const priorDate = new Date(today.setDate(today.getDate() - 30));
        const dateString = priorDate.getFullYear() + '-' + ("0" + (priorDate.getDate())).slice(-2) + '-' + ("0" + priorDate.getDate()).slice(-2);
        let url = 'https://api.github.com/search/repositories?q=created:>' + dateString + '&sort=stars&order=desc';
        if (page > 1)
            url += '&page=' + page;
        const APICall = await fetch(url);
        const response = await APICall.json();
        if (response.items !== undefined && response.items.length > 0) {
            this.saveFetchedData(response.items);
        } else {
            setTimeout(this.getGithubRepos(this.state.page), 5000);
        }
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
        this.disableLoading();
    }

    goBack() {
        if (this.state.page > 1) {
            this.enableLoading();
            this.getGithubRepos(this.state.page - 1);
            this.setState({ page: this.state.page - 1 });
        }
    }

    goNext() {
        if (this.state.page < this.state.maxPage) {
            this.enableLoading();
            this.getGithubRepos(this.state.page + 1);
            this.setState({ page: this.state.page + 1 });
        }
    }

    enableLoading() {
        this.setState({
            isLoading: true,
            loading: <div className="loading">Loading...</div>
        });
    }

    disableLoading() {
        this.setState({
            isLoading: false,
            loading: undefined
        });
    }

    render() {
        // console.log(this.state);
        let entryElements = undefined;
        let backButton = <button className="back-btnDisabled"></button>;
        let nextButton = <button className="next-btnDisabled"></button>;
        let pageNumber = this.state.page === undefined ? undefined : this.state.page;

        if (this.state.empty !== undefined && !this.state.empty && !this.state.isLoading) {
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
                backButton = <button className="back-btn" onClick={this.goBack}></button>;

            if (pageNumber < this.state.maxPage)
                nextButton = <button className="next-btn" onClick={this.goNext}></button>;
        }
        return (
            <div className="page">
                <span className="title">Trending Repos:</span>
                {this.state.loading}
                <div className="list">
                    {entryElements}
                </div>
                <div className="pagination">
                    {backButton}
                    <span className="pageNumber">{pageNumber}</span>
                    {nextButton}
                </div>
            </div>
        );
    }
  }
  
  export default StarredList;