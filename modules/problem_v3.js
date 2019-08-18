let Problem = syzoj.model('problem');
let JudgeState = syzoj.model('judge_state');
let FormattedCode = syzoj.model('formatted_code');
let Contest = syzoj.model('contest');
let ProblemTag = syzoj.model('problem_tag');
let User = syzoj.model('user')
let Article = syzoj.model('article');

const jwt = require('jsonwebtoken');

// 获取题库列表
app.get('/api/v3/problems/', async (req, res) => {
  try {
    let query = Problem.createQueryBuilder()
    // TODO 构建查询，查询条件：
    // 1. 用户权限相关
    // 2. 自定义查询条件

    // 分页查询
    let paginate = syzoj.utils.paginate(await Problem.countForPagination(query), req.query.page, syzoj.config.page.problem)
    let problems = await Problem.queryPage(paginate, query)

    // 追加TAG， 允许编辑，判题状态
    let result = []
    await problems.forEachAsync(async problem => {
      problem.judge_state = await problem.getJudgeState(res.locals.user, true)
      problem.tags = await problem.getTags()
      result.push(problem)
    })

    result = result.map(x => ({ id: x.id,
      display_id: x.id,
      title: x.title,
      ac_num: (!x.ac_num)? 0 : x.ac_num,
      submit_num: !x.submit_num ? 0 : x.submit_num,
      tags: x.tags,
      state: !x.judge_state? 0 : x.judge_state.status
    }))

    res.send({ success: true, data: result })
    } catch (e) {
      syzoj.log(e)
      res.send({ success: false })
    }
})

// 得到题目的内容
app.get('/api/v3/problem/:id', async(req, res) => {
  try {
    // TODO: 检查是否有权利查看此题, 无权查看，抛出异常
    // if (!await problem.isAllowedUseBy(res.locals.user)) {
    //   throw new ErrorMessage('您没有权限进行此操作。');
    // }
    // if (!(problem.is_public || problem.allowedEdit)) {
    //   throw new ErrorMessage('您没有权限进行此操作。');
    // }

    let id = parseInt(req.params.id)
    let problem = await Problem.findById(id)
    if(!problem) throw new ErrorMessage('无此题目。')

    let state = await problem.getJudgeState(res.locals.user, false)
    if(!state) {
      problem.state = 0
    } else {
      problem.state = state.status
    }
    problem.allowedEdit = await problem.isAllowedEditBy(res.locals.user)

    // problem.testcases = await syzoj.utils.parseTestdata(problem.getTestdataPath(), problem.type === 'submit-answer');
    problem.tags = await problem.getTags()
    // problem.discussionCount = await Article.count({ problem_id: id })

    let user = await User.findById(problem.user_id)
    problem.user = {
      username: user.username,
      nickname: user.nickname
    }

    problem.canShowTestcase = true
    problem.canShowStdCode = true
    problem.canEdit = true
    problem.difficulty = 1

    res.send({ success: true, data: problem })

  } catch (e) {
    res.send({ success: false })
  }
})

app.put('/api/v3/problem/:id', async(req, res) => {
  try{
    // TODO  权限控制


    let id = parseInt(req.params.id)
    let problem = await Problem.findById(id)
    if(!problem) throw new ErrorMessage('无此题目。')


    res.send({ success: false, data: problem })
  } catch(e) {
    res.send({ success: false })
  }
})


app.post('/api/v3/problem', async(req, res) => {
  try {

  } catch(e) {

  }
})


app.delete('/api/v3/problem/:id', async(req, res) => {
  try{
    // TODO  权限控制


    let id = parseInt(req.params.id)
    let problem = await Problem.findById(id)
    if(!problem) throw new ErrorMessage('无此题目。')

    await problem.delete()

    res.send({ success: true })
  } catch(e) {
    res.send({ success: false })
  }
})

// 得到题目的讨论
app.get('/api/v3/problem/:id/discussions', async(req, res) => {
  try {
    let id = parseInt(req.params.id)
    let problem = await Problem.findById(id)
    if (!problem) throw new ErrorMessage('无此题目。')
    // TODO: 权限判定


    let where = { problem_id: id }
    let paginate = syzoj.utils.paginate(await Article.countForPagination(where), req.query.page, syzoj.config.page.discussion)
    let articles = await Article.queryPage(paginate, where, {
      sort_time: 'DESC'
    })

    await articles.forEachAsync(async article => {
      await article.loadRelationships()
      article.user = {
        nickname: article.user.nickname,
        username: article.user.username
      }
      article.problem = {
        title: problem.title
      }
    })

    res.send({ success: true, data: articles })
  } catch(e) {
    res.send({ success: false })
  }
})

// fixme: 得到题目的提交记录
app.get('/api/v3/problem/:id/submissions', async(req, res) => {
  try {
    let id = parseInt(req.params.id)
    // let problem = await Problem.findById(id)
    // if(!problem) throw new ErrorMessage('无此题目。')

    let where = { problem_id: id }
    let paginate = syzoj.utils.paginate(await JudgeState.countForPagination(where), req.query.page, syzoj.config.page.judge_state)
    let submissions = await JudgeState.queryPage(paginate, where, {
      submit_time: 'DESC'
    })

    await submissions.forEachAsync(async submission => {
      await submission.loadRelationships()
      submission.user = {
        nickname: submission.user.nickname,
        username: submission.user.username
      }
      submission.problem = {
        title: submission.problem.title
      }
    })

    res.send({success: true, data: submissions})
  } catch(e) {
    res.send({ success: false })
  }
})

// 得到题目的测试用例
app.get('/api/v3/problem/:id/testcases', async(req, res) => {
  try {

    res.send({success: true, data: submissions})
  } catch(e) {
    res.send({ success: false, message: e.message() })
  }
})
