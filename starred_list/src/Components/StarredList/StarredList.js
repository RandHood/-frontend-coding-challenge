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

    // this method is called once the component is mounted
    componentDidMount() {
        // setting the initial state values
        this.setState({
            repoList: [],
            page: 1,
            maxPage: 34,
            empty: true,
            isLoading: true,
            loading: <div className="loading">Loading...</div>,
        });

        // calling the api to retrieve the list
        this.getGithubRepos(this.state.page);
    }

    // retrieving the repos from github
    getGithubRepos = async(page) => {
        // first, we get the date 30 days ago
        const today = new Date();
        const priorDate = new Date(today.setDate(today.getDate() - 30));
        const dateString = priorDate.getFullYear() + '-' + ("0" + (priorDate.getMonth() + 1)).slice(-2) + '-' + ("0" + priorDate.getDate()).slice(-2);
        
        // second, we construct the url using the date, and adding page attribute if we are in pages greater than the first
        let url = 'https://api.github.com/search/repositories?q=created:>' + dateString + '&sort=stars&order=desc';
        console.log(url);
        if (page > 1)
            url += '&page=' + page;
        
        // third, we call the api and try to save the fetched data from the response, if the response doesn't have data we try again in 5 seconds
        const APICall = await fetch(url);
        const response = await APICall.json();
        if (response.items !== undefined && response.items.length > 0) {
            this.saveFetchedData(response.items);
        } else {
            setTimeout(this.getGithubRepos(this.state.page), 5000);
        }
    }

    // saving the fetched data
    saveFetchedData(items) {
        // taking the relevant data
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

        // saving the data into a list in the state, and updating the empty list flag
        this.setState({ repoList, empty: false });

        // disabling loading after the data has been saved successfully
        this.disableLoading();
    }

    // go back to the previous page and retrieving its data
    goBack() {
        if (this.state.page > 1) {
            // we enable loading while we fetch
            this.enableLoading();
            this.getGithubRepos(this.state.page - 1);
            this.setState({ page: this.state.page - 1 });
        }
    }

    // go next to the following page and retrieving its data
    goNext() {
        if (this.state.page < this.state.maxPage) {
            // we enable loading while we fetch
            this.enableLoading();
            this.getGithubRepos(this.state.page + 1);
            this.setState({ page: this.state.page + 1 });
        }
    }

    // enabling loading by setting flag and html element
    enableLoading() {
        this.setState({
            isLoading: true,
            loading: <div className="loading">Loading...</div>
        });
    }

    // disabling loading by clearing flag and html element
    disableLoading() {
        this.setState({
            isLoading: false,
            loading: undefined
        });
    }

    render() {
        // setting initial values
        let entryElements = undefined;
        let backButton = <button className="back-btnDisabled"></button>;
        let nextButton = <button className="next-btnDisabled"></button>;
        let pageNumber = this.state.page === undefined ? undefined : this.state.page;

        // once we save new data we can display them in the page
        if (this.state.empty !== undefined && !this.state.empty && !this.state.isLoading) {
            // for each repo retrieved we create a RepoEntry to display its info
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

            // activating go next and go back buttons after we display new repos
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