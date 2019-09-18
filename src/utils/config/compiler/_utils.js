const getInputs = (reg, content) => {
    let inputs = [];
    let m;
    while ((m = reg.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === reg.lastIndex) reg.lastIndex++;

        // The result can be accessed through the `m`-variable.
        inputs.push(m[1] || null);
    }
    return inputs;
}

const cleanStdout = (buffer, inputs) => {
  if(Array.isArray(inputs))
    for(let i = 0; i < inputs.length; i++)
      if(inputs[i]) buffer = buffer.replace(inputs[i],'');

  return buffer;
}

module.exports = { getInputs, cleanStdout };
