import React from 'react';
import { handleIcon } from 'lib/icon';
import renderer from 'react-test-renderer';

describe('Icon tests', () => {

  describe('handleIcon', () => {

    test('With font-awesome fas', () => {
      // Given
      const icon = handleIcon({
        name: 'circle',
        font: 'font-awesome',
        style: 'solid',
      });

      // When
      const component = renderer.create(
        <span>{ icon }</span>
      );

      const tree = component.toJSON()!;

      // Then
      expect(tree).toMatchSnapshot();
    });

    test('With font-awesome fab', () => {
      // Given
      const icon = handleIcon({
        name: 'apple',
        font: 'font-awesome',
        style: 'brands',
      });

      // When
      const component = renderer.create(
        <span>{ icon }</span>
      );

      const tree = component.toJSON()!;

      // Then
      expect(tree).toMatchSnapshot();
    });

    test('With font-awesome far', () => {
      // Given
      const icon = handleIcon({
        name: 'circle',
        font: 'font-awesome',
        style: 'regular',
      });

      // When
      const component = renderer.create(
        <span>{ icon }</span>
      );

      const tree = component.toJSON()!;

      // Then
      expect(tree).toMatchSnapshot();
    });

    test('Should fallback to emoji if icon not informed', () => {
      // Given
      // Initial state

      // When
      const fallback = handleIcon(undefined, '😄');

      // Then
      expect(typeof fallback).toBe('string');
      expect(fallback).toBe('😄');
    });

    test('Should fallback to emoji if icon not informed', () => {
      // Given
      const Element = () => {
        return <h1></h1>;
      }

      // When
      const fallback = handleIcon(undefined, undefined, Element);

      // Then
      expect(typeof fallback).toBe('object');
      expect(fallback).toStrictEqual(<Element />);
    });

  });

})
