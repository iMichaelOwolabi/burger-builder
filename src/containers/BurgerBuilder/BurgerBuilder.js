import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import { transform } from '@babel/core';

const INGREDIENT_PRICES = {
  bacon: 0.1,
  salad: 0.2,
  cheese: 0.2,
  meat: 0.5
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      bacon: 0,
      salad: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 2,
    purchaseable: false,
    purchasing: false
  }

  addIngredientHandler(type) {
    let oldCount = this.state.ingredients[type];
    const updatedCount = oldCount += 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(newPrice);
  }

  removeIngredientsHandler = (type) => {
    let oldCount = this.state.ingredients[type];
    if (oldCount <= 0) return;
    const updatedCount = oldCount -= 1;
    const updatedIngredients = {...this.state.ingredients}
    updatedIngredients[type] = updatedCount;
    const priceSubtraction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceSubtraction;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(newPrice);
  };

  updatePurchaseState = (newPrice) => {
    this.setState({
      purchaseable: newPrice > 2
    })
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true })
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false})
  }

  purchaseContinueHandler = () => {
    alert('Thanks for your purchase!');
  }

  render() {
    const disabledInfo = {...this.state.ingredients};
    for(let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    return (
      <Aux>
        <Modal show={this.state.purchasing} closeModal={this.purchaseCancelHandler}>
          <OrderSummary
            ingredients={this.state.ingredients}
            cancelOrder={this.purchaseCancelHandler}
            purchaseOrder={this.purchaseContinueHandler}
          />
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientsAdded={this.addIngredientHandler.bind(this)}
          ingredientsRemoved={this.removeIngredientsHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
        />
      </Aux>
    )
  }
}

export default BurgerBuilder;
