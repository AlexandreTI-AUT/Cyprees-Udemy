it ('sem testes,ainda', () => {})

const getsomething =() => {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            resolve(13);
        },1000)
    })
}

const system =() => {
    console.log('init');
    const prom = getsomething();
    prom.then(some => {
        console.log(`Something is ${some}`);
    })
    
    console.log('end')
}

system();