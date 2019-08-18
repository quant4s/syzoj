/**
 * ok 1. 得到比赛列表
 * ok 2. 得到一个比赛详细信息（包含管理员列表和题目列表）
 * 3. 创建一个比赛
 * 4. 更新一个比赛信息
 * ok 5. 删除一个比赛
 * ok 6. 得到比赛题目的列表
 * ok 7. 得到管理员列表
 * 8. 得到排行榜
 * 9. 得到提交记录
 * 10. 查看比赛的题目
 */

let Contest = syzoj.model('contest')
let ContestRanklist = syzoj.model('contest_ranklist')
let ContestPlayer = syzoj.model('contest_player')
let Problem = syzoj.model('problem')
let JudgeState = syzoj.model('judge_state')
let User = syzoj.model('user')

const jwt = require('jsonwebtoken')

// 获取比赛列表
app.get('/api/v3/contests/', async (req, res) => {
  try {
    let where = {}
    // TODO 构建查询，查询条件：
    // 1. 用户权限相关
    // 2. 自定义查询条件

    // 分页查询
    let paginate = syzoj.utils.paginate(await Contest.countForPagination(where), req.query.page, syzoj.config.page.contest)
    let contests = await Contest.queryPage(paginate, where, {
      start_time: 'DESC'
    })

    res.send({ success: true, data: contests })
  } catch (e) {
    syzoj.log(e)
    res.send({ success: false })
  }
})

// 获取一个比赛信息
app.get('/api/v3/contest/:id', async (req, res) => {
  try {
    // TODO 用户权限检查
    // if (!res.locals.user || !res.locals.user.is_admin)
    //   throw new ErrorMessage('您没有权限进行此操作。')

    let id = parseInt(req.params.id)
    let contest = await Contest.findById(id)
    if (!contest) throw new ErrorMessage('没有这个比赛。')

    await contest.loadRelationships()

    contest.holder = {
      id: contest.holder.id,
      username: contest.holder.username
    }

    res.send({ success: true, data: contest })
  } catch (e) {
    syzoj.log(e)
    res.send({ success: false })
  }
})

// 更新一个比赛
app.put('/api/v3/contest/:id', async (req, res) => {
  try {
    // TODO 用户权限检查
    // if (!res.locals.user || !res.locals.user.is_admin)
    //   throw new ErrorMessage('您没有权限进行此操作。')

    let id = parseInt(req.params.id)
    let contest = await Contest.findById(id)
    if (!contest) throw new ErrorMessage('没有这个比赛。')

    // TODO 完整性检查


    // TODO 赋值


    await contet.save()
    res.send({success: true, data: contest})

  } catch(e) {

  }

})

// 创建一个比赛
app.post('/api/v3/contest', async (req, res) => {
  try {
    contest = await Contest.create()
    // TODO 完整性检查
    if (!['noi', 'ioi', 'acm'].includes(req.body.type)) throw new ErrorMessage('无效的赛制。')
    if (!req.body.title.trim()) throw new ErrorMessage('比赛名不能为空。')

    // TODO 赋值

    await contest.save()
    res.send({ success: true, data: contest })
  } catch(e) {

  }

})


app.delete('/api/v3/contest/:id', async (req, res) => {
  try {
    // TODO 权限控制

    let id = parseInt(req.params.id)
    let contest = await Contest.findById(id)
    if (!contest) throw new ErrorMessage('没有这个比赛。')

    await contest.delete()

    res.send({ success: true })
  } catch(e) {
    res.send({ success: false })
  }
})

app.get('/api/v3/contest/:id/problems', async (req, res) => {
  try{
    let id = parseInt(req.params.id)
    let contest = await Contest.findById(id)
    if (!contest) throw new ErrorMessage('没有这个比赛。')

    let problems = []
    if (contest.problems)
      problems = await contest.problems.split('|')
      .mapAsync(async id =>{
        let p = await Problem.findById(id)
        return {
          id: p.id,
          title: p.title
        }
      })

    res.send({ success: true, data: problems })
  } catch(e) {
    res.send({ success: false })
  }
})


app.get('/contest/:id/admins', async (req, res) => {
  try{
    let id = parseInt(req.params.id)
    let contest = await Contest.findById(id)
    if (!contest)
      throw new ErrorMessage('没有这个比赛。')

    let admins = []
    if (contest.admins)
      admins = await contest.admins.split('|')
      .mapAsync(async id => {
        let a = await User.findById(id)
        return {
          id: a.id,
          username: a.username
        }
      })

    res.send({ success: true, data: admins })
  } catch(e) {
    syzoj.log(e)
    res.send({ success: false })
  }
})

// 比赛排名榜
app.get('/api/v3/contest/:id/ranklist', async (req, res) => {
  try {

  } catch(e) {
    res.send({success: false})
  }
})

// 比赛进行中的提交记录
app.get('/api/v3/contest/:id/submissions', async (req, res) => {
  try {

  } catch(e) {
    res.send({success: false})
  }
})

// 查看比赛的题目
app.get('/api/v3/contest/:id/problem/:pid', async (req, res) => {
  try {
    let id = parseInt(req.params.id)
    let pid = parseInt(req.params.pid)

    // FIXME 用户权限检查， 是否参加了比赛
    // 确认比赛必须开始才能查看

  } catch(e) {
    res.send({success: false})
  }
})
