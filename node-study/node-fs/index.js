const fs = require('fs')
let readme = fs.createReadStream('./ceshi/readme.md')
let writeme = fs.createWriteStream('./ceshi/writeme.md')
let data = {
    status: 200,
    data: {
        list: [
            {
                name: 'csp',
                id: 1
            }
        ]
    }
}
fs.writeFileSync('./ceshi/main.text', JSON.stringify(data), (err) => {
    if (err) throw err;
})
fs.renameSync('./ceshi/main.text', './ceshi/readme.md', (err) => {})
let n = 0
n++
fs.appendFileSync('./ceshi/readme.md', n, 'utf8', (err) => {

})
fs.open('./ceshi/readme.md', 'a', (err, fd) => {
    if (err) throw err;
    console.log('fd', fd)
    fs.appendFile(fd, '追加的数据', 'utf8', (err) => {
      fs.close(fd, (err) => {
        if (err) throw err;
      });
      if (err) throw err;
    });
  });

  fs.stat('./ceshi/readme.md', (err, stats) => {
      if (err) {
          console.log(err)
      } else {
          console.log(stats)
      }
  })

  fs.readdir('./ceshi', (err, stats) => {
      console.log(stats)
  })
  fs.readFile('./ceshi/readme.md','utf8',(err, stats) => {
      fs.writeFile('./copyreadme.md', stats)
      console.log(stats)
  })
  let str = 'str + '
  
  readme.on('data', (data) => {
    str+=data
  })
  readme.on('end', (stat) => {
      console.log('str', str)
  })

    readme.pipe(writeme)
    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', () => {
      let chunk;
      // 使用循环确保我们读取所有的可用数据。
      while ((chunk = process.stdin.read()) !== null) {
        process.stdout.write(`数据: ${chunk}`);
      }
    });
    
    process.stdin.on('end', () => {
      process.stdout.write('结束');
    });

// fs.unlinkSync('./ceshi/readme.md')
// console.log(process.env)