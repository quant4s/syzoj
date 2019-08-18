let JudgeState = syzoj.model('judge_state');
let FormattedCode = syzoj.model('formatted_code');
let User = syzoj.model('user');
let Contest = syzoj.model('contest');
let Problem = syzoj.model('problem');

const jwt = require('jsonwebtoken');

// 查询评测记录
app.get('/api/v3/submissions', async (req, res) => {
  try {
    // TODO 构建查询
    let where = {}

    // 查询条件构建

    // 分页查询
    let paginate = syzoj.utils.paginate(await JudgeState.countForPagination(where), req.query.page, syzoj.config.page.contest)
    let submissions = await JudgeState.queryPage(paginate, where, {
      id: 'DESC'
    })

    await submissions.forEachAsync(async submission => {
      let user = await User.findById(submission.user_id)
      submission.user = {
        username: user.username,
        nickname: user.nickname
      }
      let problem = await Problem.findById(submission.problem_id)
      submission.problem = {
        title:  problem.title
      }
      // problem.judge_state = await problem.getJudgeState(res.locals.user, true)
      // problem.tags = await problem.getTags()
      // result.push(problem)
    })

    res.send({ success: true, data: submissions })
  } catch(e) {
    res.send({ success: false})
  }
})

// 获取一个评测记录
app.get('/api/v3/submission/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id)
    let submission = await JudgeState.findById(id)
    if (!submission) throw new ErrorMessage('提交不存在。')
    // TODO 权限检查


    let user = await User.findById(submission.user_id)
    submission.user = {
      username: user.username,
      nickname: user.nickname
    }
    let problem = await Problem.findById(submission.problem_id)
    submission.problem = {
      title: problem.title
    }

    res.send({ success: true, data: submission })
  } catch(e) {
    res.send({ success: false})
  }
})

app.get('/api/v3/submission/:id/rejudge', async(req, res) => {
  try {
    let id = parseInt(req.params.id)
    let submission = await JudgeState.findById(id)
    if (!submission) throw new ErrorMessage('提交不存在。')

    // TODO 权限检查

    await submission.rejudge()
    res.send({ success: true})
  } catch(e) {
    res.send({ success: false})
  }
})
