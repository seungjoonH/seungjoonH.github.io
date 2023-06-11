---
layout: single
title: "State 패턴 - OODP"
subtitle: "State 디자인 패턴에 대한 설명입니다"
date: "2023-05-16"
category: design-pattern
tags: [java, state]
---

## 1. 개요

**State 디자인 패턴**은 객체가 `state`에 따라 행위를 달리하는 상황에서, `state`를 객체화 하여 `state`가 행동을 할 수 있도록 책임을 위임합니다.

## 2. 종류

* 객체-행위 패턴 입니다.
  
## 3. 사용이유


## 4. 다이어그램

![factorymethod-default](/assets/images/posts/dp/factorymethod-default.png)

### 4.1. 설명

* `Product` 객체를 생성하는 코드는 `Factory` 구현체의 `create()` 에 구현되어 있습니다.

* 추상클래스 `Factory`의 `method()` 를 통해 


### 4.2. 구현

```java
public interface Product {
  public void method();
}

class ProductA implements Product {
  @Override
  public void method() {}
}
class ProductB implements Product {
  @Override
  public void method() {}
}
```

```java
public abstract class Factory {
  public Product factoryMethod() { 
    Product p = create();
    p.method(); 
    return p;
  }
  protected abstract Product create();
}

class FactoryA extends Factory {
  @Override
  protected Product create() { return new ProductA(); }
}

class FactoryB extends Factory {
  @Override
  public Product create() { return new ProductB(); }
}
```

```java
class Client {
  public static void main(String[] args) {
    Product productA = new FactoryA().factoryMethod();
    Product productB = new FactoryB().factoryMethod();
  }
}
```

## 5. 예시


