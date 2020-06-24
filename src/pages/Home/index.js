import React, { useState, useEffect } from 'react'
import { Wrapper, Image, Title, Card, Templates, Form, Button } from './styles';
import logo from '../../assets/logo.svg'
import { api } from '../../services/api';

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    (async () => {
      const resp = await fetch(api);
      const { data: { memes } } = await resp.json();
      setTemplates(memes)
    })();
  }, []);

  const handleInputChange = (index) => (e) => {
    const newValues = boxes;
    newValues[index] = e.target.value;

    setBoxes(newValues);
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log(boxes)
  }

  return (
    <Wrapper>
      <Title>MemeMaker</Title><Image src={logo}></Image>
      <Card>
        <h2>Selecione um Template:</h2>
        <Templates>
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplate(template)}
              className={template.id === selectedTemplate?.id ? 'selected' : ''}
            >
              <img src={template.url} alt={template.name} />
            </button>
          ))}
        </Templates>

        {selectedTemplate && (
          <>
            <h2>Textos</h2>
            <Form onSubmit={handleSubmit}>
              {(new Array(selectedTemplate.box_count)).fill('').map((_, index) =>(
                <input 
                  key={String(Math.random())}
                  placeholder={`Text #${index +1}`}
                  onChange={handleInputChange(index)}
                />
              ))}
              <Button type="submit">MakeMeme!</Button>
            </Form>
          </>
        )}

      </Card>
    </Wrapper>
  );
}