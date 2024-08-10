document.addEventListener('DOMContentLoaded', function () {


  // User Status Chart
  var ctxUserStatus = document.getElementById('userStatusChart').getContext('2d');
  var userStatusChart = new Chart(ctxUserStatus, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'User Status',
        data: [200, 400, 300, 500, 600, 700, 800, 500, 400, 600, 700, 800],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Statistics Chart
  var ctxStatistics = document.getElementById('statisticsChart').getContext('2d');
  var statisticsChart = new Chart(ctxStatistics, {
    type: 'doughnut',
    data: {
      labels: ['Visitors', 'Subscribers', 'Contributors', 'Authors'],
      datasets: [{
        data: [89, 45, 35, 62],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
    }
  });

  // Posts vs Comments Chart
  var ctxPostsComments = document.getElementById('postsCommentsChart').getContext('2d');
  var postsCommentsChart = new Chart(ctxPostsComments, {
    type: 'pie',
    data: {
      labels: ['Posts', 'Comments'],
      datasets: [{
        data: [35, 45],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
    }
  });
});


