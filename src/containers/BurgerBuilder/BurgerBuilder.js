import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axiosInstance from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  bacon: 0.1,
  salad: 0.2,
  cheese: 0.2,
  meat: 0.5
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 2,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false,
  }

  componentDidMount () {
    axiosInstance.get('orders/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data })
      })
      .catch(error => {
        this.setState({ error: true })
      })
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
    // alert('Thanks for your purchase!');
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice.toFixed(2),
      customer: {
        name: 'Adeola',
        address: {
          street: '78, testStreet',
          zip: 4571010,
          state: 'Ibadan',
          Country: 'Nigeria'
        }, 
        email: 'test@sample.com'
      },
      deliveryMethod: 'Regular'
    }
    axiosInstance.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(error => {
        this.setState({ loading: false, purchasing: false });
      })
  }

  render() {
    const disabledInfo = {...this.state.ingredients};
    for(let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = this.state.error ? <p>Cannot fetch ingredients at this time</p> : <Spinner />;
    let orderSummary = null;
    if (this.state.ingredients) {
      burger = ( <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientsAdded={this.addIngredientHandler.bind(this)}
          ingredientsRemoved={this.removeIngredientsHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
        />
      </Aux> );

      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        cancelOrder={this.purchaseCancelHandler}
        purchaseOrder={this.purchaseContinueHandler}
        price={this.state.totalPrice}
      />
    }

    if (this.state.loading) {
      orderSummary = <Spinner />
    }
    return (
      <Aux>
        <Modal show={this.state.purchasing} closeModal={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axiosInstance);
