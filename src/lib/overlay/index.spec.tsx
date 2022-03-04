import React from "react";
import renderer from 'react-test-renderer';

import { INSIGHT_BLOCKED, INSIGHT_HIDDEN_RESULT_SELECTOR } from "constant";
import { createResultOverlay } from ".";


describe('Overlay tests', () => {

  beforeEach(() => {
    (window.matchMedia as any) = () => {};
  });

  describe('createResultOverlay', () => {

    test('Should add basic attributes and classes', () => {
      // Given
      const element = document.createElement('div');
  
      expect(element.getAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR)).toBeNull();
      expect(element.classList.length).toBe(0);
  
      // When
      createResultOverlay(element, [], {
        header: 'some-header',
        selectorString: 'some-selector',
        text: 'some-text',
      });
  
      // Then
      expect(element.getAttribute(INSIGHT_HIDDEN_RESULT_SELECTOR)).toBe('true');
      expect(element.classList.length).toBe(1);
      expect(element.classList.contains(INSIGHT_BLOCKED)).toBe(true);
    });

    test('Should add children elements', () => {
      // Given
      const element = document.createElement('div');
      
      createResultOverlay(element, [], {
        header: 'some-header',
        selectorString: 'some-selector',
        text: 'some-text',
      });

      const Element = () => {
        return <div dangerouslySetInnerHTML={{ __html: element.outerHTML }}/>
      };

      // When
      const component = renderer.create(<Element />);
      const tree = component.toJSON();
  
      // Then
      expect(tree).toMatchSnapshot();
    });

    test('Should have texts', () => {
      // Given
      const element = document.createElement('div');
      
      // When
      createResultOverlay(element, [], {
        header: 'some-header',
        selectorString: 'some-selector',
        text: 'some-text',
      });
  
      // Then
      expect((element.querySelector('.insight-some-selector-text-wrapper') as any).innerText).toBe('some-header');
      expect((element.querySelector('.insight-some-selector-inner-text') as any).innerText).toBe('some-text');
    });

    test('Should remove overlay on click', async () => {
      // Given
      const element = document.createElement('div');
      
      createResultOverlay(element, [], {
        header: 'some-header',
        selectorString: 'some-selector',
        text: 'some-text',
      });

      expect(element.querySelectorAll('.insight-some-selector-overlay').length).toBe(1);

      // When
      (element.querySelectorAll('.insight-some-selector-overlay')[0] as any).click();
  
      // Then
      expect(element.querySelectorAll('.insight-some-selector-overlay').length).toBe(0);
    });

  });

})
