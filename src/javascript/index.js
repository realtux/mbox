/**
 * @author kounelios13
 */

(function ($) {

    const gh_api_url = "https://api.github.com";

    function show_last_commit(commit_url, commit_sha, commit_date) {
        console.log(commit_url);
        console.log(commit_sha);
        console.log(commit_date);
        with (console) {
            log(commit_url);
            log(commit_sha);
            log(commit_date);
        }
    }

    function process_commit(commit) {
        var { html_url, sha } = commit;
        var { date } = commit.commit.author;
        show_last_commit(html_url, sha, date);
    }

    function check_limits() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url:`${gh_api_url}/rate_limit`,
                datatype: "json",
                success: function (data) {
                    resolve(data);
                },
                failure: function (e) {
                    reject(e);
                }
            })
        });
    }

    function fetch_last_commit() {
        var latest_commit = JSON.parse(localStorage.getItem("last-commit"));
        if (latest_commit != null) {
            //Allow one request every 5 minutes
            //This means 12 requests/hour per unauthorized user
            const query_threshold = 5;
            console.log("Found commit in localStorage");
            var latest_commit_check = new Date(latest_commit.check_time);
            var cur_date = new Date();
            var day_diff = cur_date.getDay() - latest_commit_check.getDay();
            if (day_diff == 0) {
                var hour_diff = cur_date.getHours() - latest_commit_check.getHours();
                if (hour_diff == 0) {
                    var min_diff = cur_date.getMinutes() - latest_commit_check.getMinutes();
                    if (min_diff < query_threshold) {
                        console.log("You need to wait " + (query_threshold - min_diff) + " minutes to make a new request");
                        process_commit(latest_commit);
                        return;
                    }
                }
            }
        }

        $.ajax({
            url:`${gh_api_url}/repos/ebrian/mbox/commits/master`,
            datatype: "json",
            success: function (data) {
                console.log("Fetched commit from GitHub");
                //Add a timestamp to received commit
                //This timestamp help us determine if we can discard that commit on a  later
                //page load to receive a newer one or use that to display relevant info about mbox repo
                var commit = Object.assign(data, {
                    check_time: new Date().getTime(),
                });
                process_commit(commit)
                var cur_time = new Date().getTime();
                var last_commit_sha = data.sha;
                var last_commit_date = data.commit.author.date;
                var commit_url = data.html_url;
                localStorage.setItem("last-commit", JSON.stringify(commit));
            },
            failure: function (error) {
                console.error(error);
            }
        });

    }

    $(document).ready(function () {
        try {
            fetch_last_commit();
        } catch (e) {
            console.log(e.message);
        }
        $(".button-collapse").sideNav();
        $(".nav-wrapper li").click(function () {
            $(".nav-wrapper li").removeClass("active");
            $(this).addClass("active");
        });
    });
})(jQuery);