let ProblemTag = syzoj.model('problem_tag');

app.get('/api/v3/tags', async (req, res) => {
  try {
    let tags = await ProblemTag.find()

    res.send({ success: true, data: tags })
  } catch(e) {
    res.send({ success: true })
  }
})

app.post('/api/v3/tag', async (req, res) =>{
  try {
    // todo 权限控制
    // if (!res.locals.user || !await res.locals.user.hasPrivilege('manage_problem_tag')) throw new ErrorMessage('您没有权限进行此操作。');

    tag = await ProblemTag.create()
    tag.name = req.body.name
    tag.color = req.body.color

    await tag.save()
    res.send({ success: true, data: tag })
  } catch(e) {
    res.send({ success: false })
  }
})

app.put('/api/v3/tag/:id/', async (req, res) => {
  try {
    // todo 权限控制
    // if (!res.locals.user || !await res.locals.user.hasPrivilege('manage_problem_tag')) throw new ErrorMessage('您没有权限进行此操作。');

    let id = parseInt(req.params.id)
    let tag = await ProblemTag.findById(id)
    if (!tag) throw new ErrorMessage('tag 不存在')

    req.body.name = req.body.name.trim();
    if (tag.name !== req.body.name) {
      if (await ProblemTag.findOne({ where: { name: req.body.name } })) {
        throw new ErrorMessage('标签名称已被使用。');
      }
    }

    tag.name = req.body.name;
    tag.color = req.body.color;

    await tag.save();

    res.send({ success: true, data: tag })
  } catch (e) {
    res.send({ success: false})
  }
})

app.delete('/api/v3/tag/:id/', async (req, res) => {
  try{
    // todo 权限控制
    // if (!res.locals.user || !await res.locals.user.hasPrivilege('manage_problem_tag')) throw new ErrorMessage('您没有权限进行此操作。');

    let id = parseInt(req.params.id)
    let tag = await ProblemTag.findById(id)
    if (!tag) throw new ErrorMessage('tag 不存在')

    await tag.delete()

    res.send({success: true})
  } catch(e) {
    res.send({ success: false})
  }
})
